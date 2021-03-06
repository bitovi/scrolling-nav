// MIT License (MIT)
// Copyright (c) 2021, Bitovi <contact@bitovi.com>
//
// Permission to use, copy, modify, and/or distribute this software for any purpose
// with or without fee is hereby granted, provided that the above copyright notice
// and this permission notice appear in all copies.
//
// THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
// REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY AND
// FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
// INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM LOSS
// OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR OTHER
// TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR PERFORMANCE OF
// THIS SOFTWARE.

// The 'Template' is where the basic HTML structure and styling is defined.
// The navbar items are then injected into the <ul> tags found in this template.
const template = `
    <style>        
        scrolling-nav {
            overflow-x: auto;
            overflow-y: hidden;
            display: block;
            width: 100%;
            box-sizing: border-box;
        }
        
        scrolling-nav > ul {
            display: -webkit-box;
        }
        
        scrolling-nav > ul > li {
            display: block;
            float: left;
            cursor: pointer;
            text-decoration: none;
        }
    </style>

    <ul class='scrolling-nav-inner'></ul>
`;

const init = () => {
    class ScrollingNav extends HTMLElement {
        constructor() {
            super();
        }

        // Draw all the section headings as items in the nav.
        drawNavItems() {
            const sectionHeadings = this.getSectionHeadings();

            if (!sectionHeadings || !sectionHeadings.length) {
                return;
            }

            // Check if there were any section headings that changed before redrawing.
            if (this.nodesAreSame(this.currentNodeArr, sectionHeadings)) {
                return;
            }

            // Set innerEl (main ul element containing nav items) to correspond to the section headings
            this.innerEl.innerHTML = Array.prototype.reduce.call(sectionHeadings, (html, element) => {
                let { id, innerText } = element;
                const urlHash = this.createUrlHash(innerText);

                if (!id) {
                    element.id = id = urlHash;
                }

                return html +=
                    `<li class="scrolling-nav-item" id="scrolling-nav-item-${id}">
                        <a>${innerText}</a>
                    </li>`;
            }, '');

            // For each of the nodes, add a click event that will scroll to that section heading.
            this.querySelectorAll('li').forEach((navbarItemNode, idx) => {
                navbarItemNode.addEventListener('click', () => {
                    this.scrollToSection(sectionHeadings[idx]);
                    this.updateActiveNavItem();
                });
            });

            // Set a property to help determine if the navbar items need to be re-rendered later.
            this.currentNodeArr = this.getSectionHeadings();
        }

        // Updates what item in the navbar is currently 'active'
        // Takes optional initialHash to scroll to specific section on load
        updateActiveNavItem(initialHash) {
            const headingPositions = this.getSectionHeadingsWithPositions();
            const scrollableContainer = this.getScrollableContainer();
            let activeHeadingSection;

            if (!headingPositions || !headingPositions.length) {
                return;
            }

            if (initialHash) {
                const section = document.querySelector(initialHash);
                if (section) {
                    this.scrollToSection(section);
                }
            }

            // If the user has not scrolled down far enough, we know they are still on the first item.
            if (scrollableContainer.scrollY <= headingPositions[0].startY) {
                activeHeadingSection = headingPositions[0];
            } else {
                // Find out what navbar item is currently active by comparing the scroll position to the ... 
                // position of the current and next section heading.
                for (var i = 0; i < headingPositions.length; i++) {
                    let currentHeadingPosition = headingPositions[i];

                    if (i === headingPositions.length - 1) {
                        // If the user is at the last item, so we know that it has to be active.
                        activeHeadingSection = currentHeadingPosition;
                    } else {
                        // The user is looking at a section heading before the last and after the first.
                        const next = headingPositions[i + 1];

                        // If they are located after the start of the current position, but are still not ...
                        // at the next position, we have the section heading that is active.
                        if (
                            scrollableContainer.scrollY >= currentHeadingPosition.startY &&
                            scrollableContainer.scrollY < next.startY
                        ) {
                            activeHeadingSection = currentHeadingPosition;
                            break;
                        }
                    }
                }
            }

            // Check if the the activeNavItem has changed since the last time we updated the active classes on the nav items.
            // Only update if we need to; kind of expensive to do.
            if (activeHeadingSection.id !== this.activeHeaderId && this.getSectionHeadings().length) {
                // Remove the active class from the previously selected nav item. 
                this.querySelectorAll('li.scrolling-nav-active')
                    .forEach(node => node.classList.remove('scrolling-nav-active'));

                // Add the active class to the currently selected nav item.
                this.querySelector(`li#scrolling-nav-item-${activeHeadingSection.id}`)
                    .classList.add('scrolling-nav-active');

                // Update the URL fragment to reflect the users current position on the page.
                history.replaceState({}, activeHeadingSection.innerText, `#${activeHeadingSection.id}`);

                // Keeps the active item scrolled to the far left.
                const innerLeft = this.innerEl.offsetLeft;
                const activeLeft = this.querySelector(`ul>li#scrolling-nav-item-${activeHeadingSection.id}`).offsetLeft;
                this.scrollLeft = activeLeft - innerLeft;

                // Set a property to determine whether or not to re-render in the future.
                this.activeHeaderId = activeHeadingSection.id;
            }
        }

        // Watches for changes using the mutationObserver and updates everything if anything changes.
        observeMutations() {
            const targetNode = document.querySelector('body');
            const config = { attributes: true, childList: true, subtree: true };

            const callback = () => {
                this.drawNavItems();
                this.updateActiveNavItem();
            };

            this.mutationObserver = new MutationObserver(callback);
            this.mutationObserver.observe(targetNode, config);
        }

        // Watches the scroll and updates what is active + if the <sticky-nav> should be sticky or not.
        observeScrolling() {
            this.scrollHandler = throttle(() => this.updateActiveNavItem());

            this.getScrollableContainer().node.addEventListener('scroll', this.scrollHandler);
        }

        // Watches the resiving and updates what is active + if the <sticky-nav> should be sticky or not.
        observeResizing() {
            this.resizeHandler = () => {
                if (this.nodesAreSame(this.currentNodeArr, this.getSectionHeadings())) {
                    this.updateActiveNavItem();
                }
            }

            this.getScrollableContainer().node.addEventListener('resize', this.resizeHandler);
        }

        // Determines if two arrays of nodes are the same.
        nodesAreSame(oldNodeArr, newNodeArr) {
            // Check if the lengths are the same.
            if (!oldNodeArr || oldNodeArr.length !== newNodeArr.length) {
                return false;
            }

            // Do simple check to see if nodes and their orders are the same.
            for (var i = 0; i < oldNodeArr.length; i++) {
                if (oldNodeArr[i] !== newNodeArr[i]) {
                    return false;
                }
            }

            return true;
        }

        // Gets the container the consumer specified by the attribute 'scrollable-container-selector'.
        // If the user does not provide a selector, we assume they want the window. The method allows us ...
        // us to use a common interface, regardless of whether the consumer selects a div, article, etc. ... 
        // or we use the window to scroll.
        getScrollableContainer() {
            if (!this.scrollContainerSelector) {
                // The consumer has not specified a container to use; we assume they want the window.
                const { scrollY, innerHeight } = window;

                return {
                    node: window,
                    scrollY,
                    innerHeight,
                };
            } else {
                // The user has specified a container; we will use that.
                const node = document.querySelector(this.scrollContainerSelector);

                return node ? {
                    node,
                    scrollY: node.scrollTop,
                    innerHeight: node.offsetHeight,
                } : null;
            }
        }

        // Get the section headers specified by the attribute 'header-selector'. If no selector is provided, ...
        // we assume they want a H2 tag. Additionally, we only look inside of the element defined by the user ...
        // using the 'scrollable-conainter-selector'.
        getSectionHeadings() {
            if (this.scrollContainerSelector) {
                return this.getScrollableContainer().node.querySelectorAll(this.headingSelector);
            } else {
                return document.querySelectorAll(this.headingSelector);
            }
        }

        // Get the headings and positions of all the section headings.
        // Use the existing ID or generate one that will show in the url
        getSectionHeadingsWithPositions() {
            let headingPositions = [];

            this.getSectionHeadings().forEach(sectionHeadingNode => {
                let { id, offsetTop, innerText } = sectionHeadingNode;

                if (!id) {
                    id = this.createUrlHash(innerText);
                    sectionHeadingNode.id = id;
                }

                headingPositions.push({
                    startY: offsetTop - this.getScrollableContainer().innerHeight / 3,
                    id
                });
            });

            return headingPositions;
        }

        // Lifecycle hook invoked each time this web component is connected from the document's DOM.
        connectedCallback() {
            // Create the initial element and its structure.
            const stickyNavTemplate = document.createElement('template');
            stickyNavTemplate.innerHTML = template;
            const templateNode = document.importNode(stickyNavTemplate.content, true);
            this.append(templateNode);

            // Set the 'role' attribute on the <scrolling-nav/> for accessibility.
            this.setAttribute('role', 'navigation');

            // The 'scrollContainerSelector' property references the scroll-container-selector attribute optionally defined
            // by the user. This attributes lets the consumer define what element will be scrolled by the sticky-nav ...
            // component + where the section headings are. If not defined, it is assumed to be the 'window'.
            this.scrollContainerSelector = this.getAttribute('scrollable-container-selector');

            // // The 'headingSelector' property references the 'heading-selector' attribute optionally defined by the user.
            // // This attribute determines what elements are used as 'headings' which be used to populate the navbar.
            // // If not provided, it will fallback on a H2 tag.
            this.headingSelector = this.getAttribute('heading-selector') || 'h2';

            // For convenience, define the <ul> tag as the innerEl.
            this.innerEl = this.querySelector('ul');

            // Check for initial url hash to adjust initial scroll position
            const initialHash = location.hash;

            // Initialize the navbar at the state of its items.
            this.drawNavItems();
            this.updateActiveNavItem(initialHash);

            // Set up observers.
            this.observeMutations();
            this.observeScrolling();
            this.observeResizing();
        }

        // Lifecycle hook invoked each time this web component is disconnected from the document's DOM.
        disconnectedCallback() {
            // Disconnect all observers.
            this.mutationObserver.disconnect();
            this.getScrollableContainer().node.removeEventListener('scroll', this.scrollHandler);
            this.getScrollableContainer().node.removeEventListener('resize', this.resizeHandler);
        }

        // Scroll to heading so it is fully visible below navbar
        scrollToSection(sectionHeading) {
            const navBottom = this.getBoundingClientRect().bottom;
            const sectionBottom = sectionHeading.offsetTop;
            const sectionHeight = sectionHeading.clientHeight;
            this.getScrollableContainer().node.scroll({ top: sectionBottom - sectionHeight - navBottom });
        }

        // Generate url hash shown in the url and used to identify sections 
        createUrlHash(str = '') {
            return str.toLowerCase().split(' ').join('-').replace('&', 'and');
        }
    }

    window.customElements.define('scrolling-nav', ScrollingNav);
}

// Throttles the calls of the function provided.
// Used for scroll events to reduce the expense.
function throttle(func) {
    return function() {
        const args = arguments;
        window.requestAnimationFrame(() => {
            func.apply(this, args);
        });
    }
}

if (typeof window !== 'undefined' && typeof HTMLElement !== 'undefined') {

    if (document.readyState === 'complete' || document.readyState === 'interactive') {
        init();
    } else {
        document.addEventListener('readystatechange', () => {
            if (document.readyState === 'interactive') {
                init();
            }
        });
    }
}
