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
        scrolling-nav::-webkit-scrollbar {
            display: none;
        }
        
        scrolling-nav {
            overflow-x: scroll;
            overflow-y: hidden;
            display: block;
            width: 100%;
            box-sizing: border-box;
        }
        
        scrolling-nav > ul {
            display: -webkit-box;
        }
        
        scrolling-nav>ul>li {
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

            // The 'scrollContainerSelector' property references the scroll-container-selector attribute optionally defined
            // by the user. This attributes lets the consumer define what element will be scrolled by the sticky-nav ...
            // component + where the section headings are. If not defined, it is assumed to be the 'window'.
            this.scrollContainerSelector = this.getAttribute('scrollable-container-selector');

            // The 'headingSelector' property references the 'heading-selector' attribute optionally defined by the user.
            // This attribute determines what elements are used as 'headings' which be used to populate the navbar.
            // If not provided, it will fallback on a H2 tag.
            this.headingSelector = this.getAttribute('heading-selector') || 'h2';
        }

        // Draw all the section headings as items in the nav.
        drawNavItems() {

            const sectionHeadings = this.getSectionHeadings();

            // Check if there were any section headings that changed before redrawing.
            if (this.nodesAreSame(this.currentNodeArr, sectionHeadings)) {
                return;
            }

            const navbarItemsTemplate = document.createElement("template");

            let navbarItems = '';

            // Go through each of the section headings and create navbar items.
            sectionHeadings.forEach(({ innerText }) => {
                // Concat this navbar item into the navbarItems string.
                navbarItems +=
                    `<li class="scrolling-nav-item">
                        <a>${innerText}</a>
                    </li>`;
            });

            navbarItemsTemplate.innerHTML = navbarItems;

            this.innerEl.replaceChildren(navbarItemsTemplate.content.cloneNode(true));

            const navbarItemNodes = this.querySelectorAll('li');

            // For each of the nodes, add a click event that will scroll to that section heading.
            navbarItemNodes.forEach((navbarItemNode, idx) => {
                navbarItemNode.addEventListener('click', () => {

                    // Scroll to heading so it is fully visible below navbar
                    const navBottom = this.getBoundingClientRect().bottom;
                    const sectionBottom = sectionHeadings[idx].offsetTop;
                    const sectionHeight = sectionHeadings[idx].clientHeight;
                    window.scroll({ top: sectionBottom - sectionHeight - navBottom });

                    // sectionHeadings.forEach((el, i) => {
                    //     if (i === idx) {
                    //         el.classList.add('scrolling-nav-active');
                    //     } else {
                    //         el.classList.remove('scrolling-nav-active');
                    //     }
                    // });

                });
            });

            // Set a property to help determine if the navbar items need to be re-rendered later.
            this.currentNodeArr = this.getSectionHeadings();
        }

        // Updates what item in the navbar is currently 'active' 
        updateActiveNavItem() {
            const headingPositions = this.getSectionHeadingsWithPositions();
            console.log(headingPositions);
            let activeNavItem = headingPositions[0] || {};
            let updatedActiveItem = {};
            const scrollableContainer = this.getScrollableContainer();

            // If the user has not scrolled down far enough, we know they are still on the first item.
            if (headingPositions.length === 0 || scrollableContainer.scrollY <= headingPositions[0].startY) {
                updatedActiveItem = headingPositions[0];
            } else {
                // Find out what navbar item is currently active by comparing the scroll position to the ... 
                // position of the current and next section heading.
                for (var i = 0; i < headingPositions.length; i++) {
                    let currentHeadingPosition = headingPositions[i];

                    if (i === headingPositions.length - 1) {
                        // If the user is at the last item, so we know that it has to be active.
                        updatedActiveItem = currentHeadingPosition;
                    } else {
                        // The user is looking at a section heading before the last and after the first.
                        const next = headingPositions[i + 1];

                        // If they are located after the start of the current position, but are still not ...
                        // at the next position, we have the section heading that is active.
                        if (
                            scrollableContainer.scrollY >= currentHeadingPosition.startY &&
                            scrollableContainer.scrollY < next.startY
                        ) {
                            updatedActiveItem = currentHeadingPosition;
                            break;
                        }
                    }
                }
            }

            // Verify that the updatedActiveItem has been set; otherwise use the current/default activeNavItem.
            if (updatedActiveItem && updatedActiveItem.urlHash) {
                activeNavItem = updatedActiveItem;
                console.log('updated activeNaveItem');
            }

            console.log({ activeNavItem: activeNavItem.urlHash, activeHeader: this.activeHeaderUrlHash });
            // Check if the the activeNavItem has changed since the last time we updated the active classes on the nav items.
            // Only update if we need to; kind of expensive to do.
            if (activeNavItem.urlHash !== this.activeHeaderUrlHash && this.getSectionHeadings().length > 0) {
                console.log('in conditional');
                // Remove the active class from the previously selected nav item. 
                // this.querySelectorAll("li.scrolling-nav-active")
                //     .forEach(node => node.classList.remove("scrolling-nav-active"));
                // this.querySelector(`li[data-url-hash="${activeNavItem.dataset.urlHash}"]`)
                //     .classList.add("scrolling-nav-active");

                // Add the active class to the currently selected nav item.
                let activeItemInNav;
                this.querySelectorAll('li.scrolling-nav-item').forEach(navItem => {
                    // console.log({ activeNavItem });
                    const hash = this.createUrlHash(navItem.children[0].innerText);
                    console.log(hash);
                    if (hash === activeNavItem.urlHash) {
                        // activeItemInNav = navItem;
                        console.log('match', navItem);
                        // navItem.classList.add('scrolling-nav-active');
                    } else {
                        console.log('not a match');
                        // navItem.classList.remove('scrolling-nav-active');
                    }
                })


                // Update the URL fragment to reflect the users current position on the page.
                history.replaceState({}, activeNavItem.innerText, `#${activeNavItem.urlHash}`);

                // Keeps the active item scrolled to the far left.
                // const innerLeft = this.innerEl.offsetLeft;
                // const activeLeft = activeItemInNav.offsetLeft;
                // const activeLeft = this.querySelector(`ul>li[data-url-hash="${activeNavItem.urlHash}"`).offsetLeft;
                // this.scrollLeft = activeLeft - innerLeft;

                // Set a property to determine whether or not to re-render in the future.
                this.activeHeaderUrlHash = activeNavItem.urlHash;
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
            this.scrollEventListener = this.getScrollableContainer().node.addEventListener("scroll", throttle(() => {
                this.updateActiveNavItem();
            }, 500));
        }

        // Watches the resiving and updates what is active + if the <sticky-nav> should be sticky or not.
        observeResizing() {
            this.resizeEventListener = this.getScrollableContainer().node.addEventListener("resize", () => {
                if (this.nodesAreSame(this.currentNodeArr, this.getSectionHeadings())) {
                    this.updateActiveNavItem();
                }
            });
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

                return {
                    node,
                    scrollY: node.scrollTop,
                    innerHeight: node.offsetHeight,
                }
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
        getSectionHeadingsWithPositions() {
            let headingPositions = [];

            // For each of the section headings, determine its position. 
            this.getSectionHeadings().forEach(sectionHeadingNode => {

                const { offsetTop, innerText } = sectionHeadingNode;

                const urlHash = this.createUrlHash(innerText);

                sectionHeadingNode.dataset.urlHash = urlHash;

                headingPositions.push({
                    startY: offsetTop - this.getScrollableContainer().innerHeight / 3,
                    urlHash
                });
            });

            // Return the section headings hydrated with their position data.
            return headingPositions;
        }

        // Lifecycle hook invoked each time this web component is connected from the document's DOM.
        connectedCallback() {
            // Create the initial element and its structure.
            const stickyNavTemplate = document.createElement("template");
            stickyNavTemplate.innerHTML = template;
            const templateNode = document.importNode(stickyNavTemplate.content, true);

            this.append(templateNode);

            // Set the 'role' attribute on the <stick-nav/> for accessibility.
            this.setAttribute('role', "navigation");

            // For convenience, define the <ul> tag as the innerEl.
            this.innerEl = this.querySelector("ul");

            // Initialize the navbar at the state of its items.
            this.drawNavItems();
            this.updateActiveNavItem();

            // Set up observers.
            this.observeMutations();
            this.observeScrolling();
            this.observeResizing();
        }

        // Lifecycle hook invoked each time this web component is disconnected from the document's DOM.
        disconnectedCallback() {
            // Disconnect all observers.
            this.mutationObserver.disconnect();
            this.scrollEventListener.removeEventListener();
            this.resizeEventListener.removeEventListener();
        }

        createUrlHash(str = '') {
            return str.toLowerCase().split(' ').join('-').replace('&', 'and');
        }
    }

    window.customElements.define("scrolling-nav", ScrollingNav);
}

// Throttles the calls of the function provided.
// Used for scroll events to reduce the expense.
const throttle = (func, limit) => {
    let inThrottle;

    return function() {
        const args = arguments;
        const context = this;

        if (!inThrottle) {
            func.apply(context, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    }
}

setTimeout(() => {
    init();
}, 0);