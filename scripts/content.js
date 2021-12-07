//alert("I am on a profile page");

//global imports (avoid these)


/////////////// * ---- GLOBAL VARIABLES ---- * /////////////////
var url = "";
const todoresp = {todo: "showPageAction"};

///////////// * GLOBAL VARIABLES ENDS HERES * /////////////////


//invoked main driver function
chrome.runtime.sendMessage(todoresp);
main();




//trigger different functionalities in main functions
function main() {
    
    // define any VARIABLES below here
    var data = {};

    //////////VARIABLES END///////////

    //expand page sections
    //expandButtons();

    //generate the DOM nodes below
    //extractBtnGen();
    sliderGen();
     //DOM node generators above//

    //listener to trigger pageAction//
    chrome.runtime.onMessage.addListener(function (msg, sender, sendResponse) {
      if(msg.todo == "toggle") {
        slider();
      }
    });


   

    // var extractBtn = document.getElementById("extractBtn");
    // extractBtn.addEventListener("click", function() {


    //     //run functionalities within this nested function block
    //     //this will trigger things everytime extractBtn is 
    //     //clicked.
    //     //slider(); //this will toggle slider bar into the window

    //     data = extract(); //trigger on clicking toggle as well
    //     var frame = document.getElementById("slider");
    //     frame.textContent = JSON.stringify(data)
    // } );


    //Added this as a temporary solution
    //Issue: The page doesn't fully load and content script 
    //       runs only once
    //Resolution: Added trigger through window.onscroll
    //            function to register extraction everytime
    //            a user scrolls on the webpage.
   
    data = extract();   
    var bodycontainer = document.getElementById("slider").querySelector("#sbodycontainer");
    bodycontainer.textContent = JSON.stringify(data)                   
    window.onscroll = function() {
        data = extract();
        //alert(JSON.stringify(data));
        var bodycontainer = document.getElementById("slider").querySelector("#sbodycontainer");
        //below code appends the data values onto the 
        // slider frame
        bodycontainer.textContent = JSON.stringify(data)
    }
    
}


//*=======================================================*//


//extract btn generator
function extractBtnGen() {
    var extractBtn = document.createElement("div");
    extractBtn.textContent = "Toggle Frame";
    extractBtn.id = "extractBtn";
    document.querySelector("#global-nav").append(extractBtn)
}

//slider window element generator
function sliderGen() {
    var slider = document.createElement("div");
    slider.id = "slider";
    //slider.src = chrome.extension.getURL("./views/slider.html");
    //var sliderFileUrl = chrome.extension.getURL("/views/slider.html");
    //alert(sliderFileUrl)
    //append slider to webpage

    var sliderDivInnerHTML = "\
    <div id='sheader'><h2>Header</h2><hr/></div>\
    <div id='sbodycontainer'></div>\
    <div id='sfooter'><hr/><h2>footer</h2></div>\
    ";

    slider.innerHTML += sliderDivInnerHTML;
    {
      //blockity blockity ad removal property
      /* apparently this doesn't work always
      linkedin has a mechanism to block ad-banner removal 
       y-variable is working fine so far. kept in x just in case
      */
    
      var x = document.getElementsByClassName("ad-banner");
      var y = $(".ad-banner-container")
      try {
        x[0].remove();
        y.remove();
      } catch(err) {console.log(err);}
    }

    document.body.prepend(slider);
}

//slider function to toggle the slider frame
function slider() {
    var slider = document.getElementById("slider");

    var styler = slider.style;
    //alert("slider" + slider);

    //toggle slider
    if(styler.width == "0px") {
        styler.width = "400px";
    } else {
        styler.width = "0px";
    }
}

//module for extracting the details
function extract() {
    /// vars go below this
    var userProfile = {};

    // vars end here

      //////////////

    // retreiving profile Section data
    const profileSection = document.querySelector(".pv-top-card");
    
    const fullNameElement = profileSection?.querySelector('h1')
    const fullName = fullNameElement?.textContent || null

    const titleElement = profileSection?.querySelector('.text-body-medium')
    var title = titleElement?.textContent || null

    var tbs = profileSection?.querySelectorAll(".text-body-small")
    const locationElement = ((tbs) ? tbs[1] : null)
    var location = locationElement?.textContent || null

    const photoElement = document.querySelector(".pv-top-card-profile-picture__image") || profileSection?.querySelector('.profile-photo-edit__preview')
    const photo = photoElement?.getAttribute('src') || null

    const descriptionElement = document.querySelector('.pv-about-section > div')// Is outside "profileSection"
    var description = descriptionElement?.textContent || null
        

    const url = window.location.url;
    var rawProfileData = {
        fullName,
        title,
        location,
        photo,
        description,
        url
    }

    var profileData = {
        fullName: getCleanText(rawProfileData.fullName),
        title: getCleanText(rawProfileData.title),
        location: getCleanText(rawProfileData.location),
        description: getCleanText(rawProfileData.description),
        photo: rawProfileData.photo,
        url: rawProfileData.url
    }
    ///extraction of profile data ends here///

    ///extraction of experiences below
    var nodes = $("#experience-section > ul > li");
    //alert(JSON.stringify(nodes));
    let UwU = [] //init array of uwu company data
    
    //loop over nodes to push data in UwU
    for(const node of nodes) {
      const titleElement = node.querySelector('h3');
      var title = titleElement?.textContent || null
      title = getCleanText(title);

      const employmentTypeElement = node.querySelector('span.pv-entity__secondary-title');
      var employmentType = employmentTypeElement?.textContent || null
      employmentType = getCleanText(employmentType);

      const companyElement = node.querySelector('.pv-entity__secondary-title');
      const companyElementClean = (companyElement && companyElement?.querySelector('span') ) ? (companyElement?.removeChild(companyElement.querySelector('span') )  && companyElement ): (companyElement || null);
      var company = companyElementClean?.textContent || null
      company = getCleanText(company);

      const descriptionElement = node.querySelector('.pv-entity__description');
      var description = descriptionElement?.textContent || null
      description = getCleanText(description);

      const dateRangeElement = node.querySelector('.pv-entity__date-range span:nth-child(2)');
      const dateRangeText = dateRangeElement?.textContent || null

      const startDatePart = dateRangeText?.split('–')[0] || null;
      const startDate = startDatePart?.trim() || null;

      const endDatePart = dateRangeText?.split('–')[1] || null;
      const endDateIsPresent = endDatePart?.trim().toLowerCase() === 'present' || false;
      const endDate = (endDatePart && !endDateIsPresent) ? endDatePart.trim() : 'Present';

      const locationElement = node.querySelector('.pv-entity__location span:nth-child(2)');
      var location = locationElement?.textContent || null;
      location = getCleanText(location);
      
      

      //UwU push!
      UwU.push({
          title,
          company,
          employmentType,
          location,
          startDate,
          endDate,
          endDateIsPresent,
          description
      });

    
    }//loop ends here

    var experiences = UwU;
    //extraction of experiences ends here//

    // extracting education section
    var nodes = $("#education-section ul > .ember-view");
    let education = [];

    for (const node of nodes) {

        const schoolNameElement = node.querySelector('h3.pv-entity__school-name');
        var schoolName = schoolNameElement?.textContent || null;
        schoolName = getCleanText(schoolName);

        const degreeNameElement = node.querySelector('.pv-entity__degree-name .pv-entity__comma-item');
        var degreeName = degreeNameElement?.textContent || null;
        degreeName = getCleanText(degreeName);

        const fieldOfStudyElement = node.querySelector('.pv-entity__fos .pv-entity__comma-item');
        var fieldOfStudy = fieldOfStudyElement?.textContent || null;
        fieldOfStudy = getCleanText(fieldOfStudy);

        // const gradeElement = node.querySelector('.pv-entity__grade .pv-entity__comma-item');
        // const grade = (gradeElement && gradeElement.textContent) ? window.getCleanText(fieldOfStudyElement.textContent) : null;

        const dateRangeElement = node.querySelectorAll('.pv-entity__dates time');

        const startDatePart = dateRangeElement && dateRangeElement[0]?.textContent || null;
        const startDate = startDatePart || null

        const endDatePart = dateRangeElement && dateRangeElement[1]?.textContent || null;
        const endDate = endDatePart || null
        
        
        education.push({
        schoolName,
        degreeName,
        fieldOfStudy,
        startDate,
        endDate
      })
    }
    //extraction of education ends here
    

    //extraction of licenses and certifications starts
    let skills = [];
    var skillNameNodes = document.querySelectorAll('.pv-skill-category-entity__name-text');
    var endorsementCountNodes = document.querySelectorAll('.pv-skill-category-entity__endorsement-count');
    
    for(var i=0; i<skillNameNodes.length; i++)
      {
        if(endorsementCountNodes[i]) {
        skills.push(
          {
            "skillName": getCleanText(skillNameNodes[i].textContent),
            "endorsementCount": endorsementCountNodes[i].textContent
          }
        );
      } else {
        skills.push(
          {
            "skillName": getCleanText(skillNameNodes[i].textContent),
            "endorsementCount": "0"
          }
          );
      }
    }
      
    //add in the extracted object values here
    userProfile = {
        "profileData": profileData,
        "experiences": experiences,
        "education": education,
        "skills": skills
    }

    return userProfile;
}


function expandButtons() {
    const expandButtonsSelectors = [
        '.pv-profile-section.pv-about-section .lt-line-clamp__more', // About
        '#experience-section .pv-profile-section__see-more-inline.link', // Experience
        '.pv-profile-section.education-section button.pv-profile-section__see-more-inline', // Education
        '.pv-skill-categories-section [data-control-name="skill_details"]', // Skills
      ];

      const seeMoreButtonsSelectors = ['.pv-entity__description .lt-line-clamp__line.lt-line-clamp__line--last .lt-line-clamp__more[href="#"]', '.lt-line-clamp__more[href="#"]:not(.lt-line-clamp__ellipsis--dummy)']

      for (const buttonSelector of expandButtonsSelectors) {
        try {
          if ($(buttonSelector) !== null) {
            $(buttonSelector).click();
          }
        } catch (err) {
          alert("Couldn't expand buttons");
        }
      }


      for (const seeMoreButtonSelector of seeMoreButtonsSelectors) {
        const buttons =  $(seeMoreButtonSelector)

        for (const button of buttons) {
          if (button) {
            try {
                button.click()
            } catch (err) {
              alert("Error expanding see more buttons");
            }
          }
        }
      }
}





//////////// *---- UTILS -----* //////////////

function getCleanText(text) {
    const regexRemoveMultipleSpaces = / +/g
    const regexRemoveLineBreaks = /(\r\n\t|\n|\r\t)/gm
  
    if (!text) return null
  
    const cleanText = text
      .replace(regexRemoveLineBreaks, '')
      .replace(regexRemoveMultipleSpaces, ' ')
      .replace('...', '')
      .replace('See more', '')
      .replace('See less', '')
      .trim()
  
    return cleanText
}





///// *----- TEXT CONTENT INJECTION ---- *////
function insertHTMLinSlider() {
  
}

//////// * ----- UTILS ENDS -------* /////////
