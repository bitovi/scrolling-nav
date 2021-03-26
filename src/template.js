const template = `
        <style>
            #sticky-nav-outer::-webkit-scrollbar {
                display: none;
            }
            
            #sticky-nav-outer {
                height: 3rem;
                overflow-x: scroll;
                overflow-y: hidden;
                margin: 1rem auto 0.5rem auto;
                background-color: white;
                padding: 0.5rem 0.5rem 0.5rem 0; 
                width: calc(100% - 16px);
            }

            #sticky-nav-outer.fixed {
                width: calc(50% - 3px);
                height: 5rem;
                border-bottom: 1px solid #ccc;
                position: fixed;
                top: 0;
                margin-top: 0;
                margin-left: -16px;
                padding: 25px;
                box-shadow: 0 0 4px rgba(0, 0, 0, 0.2);
            }
            
            #sticky-nav-inner {
                display: -webkit-box;
            }
            
            #sticky-nav-inner>.sticky-nav-element {
                display: block;
                float: left;
                margin-right: 15px;
                color: #666666;
                font-size: 18px;
                font-weight: 400;
                cursor: pointer;
                transition: all 0.3s;
                padding: 0.3rem 0.6rem;
                text-decoration: none;
            }
            
            #sticky-nav-inner>.sticky-nav-element:hover {
                background-color: #eee;
            }
            
            #sticky-nav-inner>.sticky-nav-element.active {
                background-color: #666666;
                color: white;
                font-weight: 500;
            }
            
            @media only screen and (max-width: 800px) {
                #sticky-nav-outer {
                    width: 500px;
                }
            }
        </style>
        <div id='sticky-nav-outer'>
            <div id='sticky-nav-inner'></div>
        </div>
    `;

module.exports = {
    template
};