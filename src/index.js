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
// The navbar elements are then injected into this template.
const { template } = require('./template');

const init = () => {

    // Checks to make sure that the document has been defined and that it is ready to inject the navbar into.
    // If the navbar has has been imported before the document is ready, it will retry every .5 seconds until it can be inject.
    if (typeof document === 'undefined' || document.readyState !== 'complete') {
        setTimeout(() => {
            init();
        }, 500);

        return false;
    }

    // Creates an template HTML element.
    const stickyNavbarTemplate = document.createElement("template");

    // Inside of the template element, we inject the HTML and styling we imported from ./template.js
    stickyNavbarTemplate.innerHTML = template;

    // We create a class that will be used to create an instance of this web component.
    // Note that while it extends HTML element, it does not inherit any of the attributes
    // generally associated with HTML elements, such as ID, etc.
    class StickyNavbar extends HTMLElement {
        constructor() {
            super();

            // User defined attributes // START //

            // The containerTag attribute is the tag (HTML element, class, or ID) that the navigation will be injected into.
            // By default, it will be injected into its own tags (<sticky-nav />) implemented by the consuming application.
            this.containerTag = this.getAttribute('container') || 'sticky-nav';

            // The headingTag attribute is the tag (HTML element, class, or ID) that will be used to create the navbar elements.
            // By default, it will scour the <body> for H2 tags.
            this.headingTag = this.getAttribute('heading') || 'h2';

            // The sticky attribute determines whether the 'fixed' class gets added to the outermost div. 
            // This class defaults to having a 'fixed' position style property.
            // By default, it will assume the consuming application wants a sticky navbar.
            this.sticky = this.getAttribute('sticky') || true;

            // User defined attributes // END //

            // This creates a reference to the parent node of the navbar.
            const containerNode = document.querySelector(this.containerTag);

            // This creates a reference to the template node of the navbar.
            const templateNode = document.importNode(stickyNavbarTemplate.content, true);

            // This injects the template node into the container node.
            containerNode.append(templateNode);

            // This is where we define convenience properties to easily access the inner and outer divs
            // we defined in the HTML found in the template.
            this.outerEl = document.querySelector("#sticky-nav-outer");
            this.innerEl = document.querySelector("#sticky-nav-inner");

            // Add a event listener that will update the highlighting as the user scrolls.
            window.addEventListener("scroll", () => {
                this.updateHighlighting();
            });

            // This method does the initial call to populate the navbar elements.
            // Elements might be added or removed; but this is the initial state.
            this.populateElements();

            // This method watches the body node for any changes that match the section tag we are tracking.
            // If there are any changes, it will repopulate the elements in the navbar.
            this.observeMutations();
        }

        // This method handles the population of the navbar elements and watches for changes
        // to either add remove them.
        populateElements() {
            // Create the template that we will use to wrap all the navbar elements.
            const navbarElementsTemplate = document.createElement("template");

            // Grab all the section header nodes that we want to link to via the navbar.
            this.elements = document.querySelectorAll(this.headingTag);

            // Initialize an array that will be used store the vertical position of each of the section headers. 
            this.positions = [];

            // Intitialize a string that all of the nevbar elements will be added to.
            let navbarElements = "";

            // Loop through all of the section header nodes.
            this.elements.forEach((el, idx) => {
                // Grab the name of the section header node and its vertical position.
                const { innerText: label, offsetTop } = el;

                // Grab the ID from the current section header node. 
                let id = el.id;

                // If this section header node does not have an id, let's add one.
                if (!id) {
                    id = `sticky-nav-el-${idx}`;
                    el.id = id;
                }

                // Let's push the id its position of this section header node into the positions array.
                this.positions.push({
                    // This section starts when it's 2/3s of the way into the viewport.
                    startY: offsetTop - window.innerHeight / 3,
                    id,
                });

                // Add a new navbar element to the navbarElements string;
                navbarElements += `<div class="sticky-nav-element" id="selection-element-${id}">${label}</div>`;
            });

            // Define the innerHTML of the template to the be string with all of the navbar elements in it.
            navbarElementsTemplate.innerHTML = navbarElements;

            // Replace all the contents/children of the inner navbar div (that is the direct parent of the 
            // all the navbar elements).
            this.innerEl.replaceChildren(navbarElementsTemplate.content.cloneNode(true));

            // Update the barElements property to reference the latest iteration of navbar elements.
            this.barElements = document.querySelectorAll('.sticky-nav-element');

            // For each of the navbar elements:
            this.elements.forEach(element => {
                // If a user clicks one:
                document.querySelector(`#selection-element-${element.id}`).addEventListener('click', () => {
                    const { innerText: label, id, offsetTop } = element;

                    // This updates the URL to include the fragment/id of the navbar element being click links to.
                    history.replaceState({}, label, `#${id}`);

                    // This scrolls the window to the element the navbar element being click links to.
                    window.scrollTo(0, offsetTop - 70);
                });
            });

            // Re-apply the logic that determines what navbar element should be 'marked' as active.
            this.updateHighlighting();
        }

        // This method watches for changes to the body node and repopulates the navbar elements if needed.
        observeMutations() {
            // Select the node that will be observed for mutations
            const targetNode = document.querySelector('body');

            // Options for the observer (which mutations to observe)
            const config = { attributes: true, childList: true, subtree: true };

            // Callback function to execute when mutations are observed
            const callback = mutationsList => {
                // This flag will be flipped if we determine a node was added or removed.
                let refreshNeeded = false;

                // Loop through any changes to the body nody.
                for (const mutation of mutationsList) {

                    // If the change was the addition or removal of the child elements.
                    if (mutation.type === 'childList') {

                        // For each of the nodes in the new state:
                        mutation.addedNodes.forEach(e => {

                            // If the node changed is the tag we're interested in
                            if (e.tagName === this.headingTag.toUpperCase()) {

                                // Set flag to repopulate the navbar elements.
                                refreshNeeded = true;
                            }
                        });

                        // Update the elements property to include any new sections added.
                        this.elements = document.querySelectorAll(this.headingTag);
                    }
                }

                // If the refresh needed flag is set:
                if (refreshNeeded) {
                    // Repopulate the the elements in the navbar.
                    this.populateElements();
                }
            };

            // Create an observer instance linked to the callback function
            this.observer = new MutationObserver(callback);

            // Start observing the target node for configured mutations
            this.observer.observe(targetNode, config);
        }


        // This helper method udpates what elements is current marked as active.
        updateHighlighting() {
            // Initialize the current currently 'active' element to the first element, if there are elements
            // or to an empty object if there aren't any
            let active = this.positions[0] || {};

            // Initialize an empty object that will house any newly selected element before being assigned
            // the the active state.
            let newEl = {};

            // Get the vertical scroll position of the top menu. 
            const menuPosY = this.outerEl.offsetTop;

            // If the user doesn't want the the navbar to be sticky they turn this flag off.
            if (this.sticky) {

                // If the user has scrolled past the menu, add the 'fixed' class.
                if (window.scrollY >= menuPosY + 5) {
                    this.outerEl.classList.add("fixed");

                    // If the users has the scrolled up to where menu in would be in their viewport, 
                    // remove the 'fixed' class.
                } else {
                    this.outerEl.classList.remove("fixed");
                }
            }

            // For all of the section headers:
            for (var i = 0; i < this.positions.length; i++) {

                // The current section header in the loop.
                let current = this.positions[i];

                // If this hits, it means that the users is scrolled all the way to the bottom
                // so we know that they the last navbar element should be marked as 'active'.
                if (i === this.positions.length - 1) {
                    active = current;
                } else {
                    // Look at the next elements position and the current elements position.
                    // If the user is scrolled to where they are after one element (current), but not yet
                    // at the next element (next), we know the current element is active.
                    let next = this.positions[i + 1];
                    if (
                        window.scrollY >= current.startY &&
                        window.scrollY < next.startY
                    ) {
                        newEl = current;
                        // If we have the element the user is looking at, we break the loop.
                        break;
                    }
                }
            }

            // Make the active element the new element currently scrolled to
            active = newEl;

            // Verify there are any elements to inject into the navbar.
            if (this.elements.length > 0) {

                // Remove the 'active' class from all of the navbar elements.
                document
                    .querySelectorAll(".sticky-nav-element")
                    .forEach((e) => e.classList.remove("active"));

                // Add an 'active' class to the element we determined as being viewed.
                document
                    .querySelector(`#selection-element-${active.id}`)
                    .classList
                    .add("active");

                // Get how where the inner navbar container is from the leftside of the viewport.
                const innerLeft = this.innerEl.offsetLeft;

                // Get how far left the active element is in the navbar from the leftside of the viewport.
                const activeLeft = document.querySelector(`#selection-element-${active.id}`).offsetLeft;

                // See how far we should scroll the inner navbar container to make the active element left-aligned.
                this.outerEl.scrollLeft = activeLeft - innerLeft;
            }
        }

        // A built-in method for web components. This will run when the element is removed from the consuming
        // application's page, i.e. they go to a new page.
        disconnectedCallback() {

            // Disconnect the mutionation observer.
            this.observer.disconnect();
        }
    }

    window.customElements.define("sticky-nav", StickyNavbar);
}

init();