Do as you please with the code with a bit of integrity I guess.

## What is required to coded?

Currently, I am busy with heavy school work. So probably not going to touch this repo for long time. Education section and some other sections need scraping code. You can contribute there.

Extraction for each section is carried out separately by the client/user when they perform "click" event. Each click event invokes a special function for the corresponding section.
So in a sense the code is a bit modular. The majority of javascript action takes place in `content.js` file. This is where I also make use of Javascript to inject the `Slider` of the extension.

The `main()` function runs all the procedures from DOM generators to eventTrigger functions. Only the `Slider` toggle procedure is run outside of `main()` which interacts with the `service_worker` file in the background to handle the click-event trigger for the slider to slide-in or out of the window view.

There are some utility functions as well. Mostly concerned with scraping the data coherently. 
