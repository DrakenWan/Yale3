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
    
    ///////// VARIABLES //////////
    // define any VARIABLES below here
    var data = {};


    // Edit this string to edit the slider popup 
    // (appears on clicking extension
    // icon)
    var sliderInnerHTMLString = "\
    <!-- HEADER IS HERE -->\
    <div id='sheader'>\
    <div id='sheaderheader'></div>\
    <div id='deepscancontainer'>\
    <label id='deepscanlabel' for='deepscan'>Deepscan?<input type='checkbox' name='deepscan' id='deepscan' value='deepscan'/></label>\
    </div>\
    </div>\
    <br/>\
    \
    \
    <!-- THE BODY CONTAINER IS HERE -->\
    <div id='sbodycontainer'>\
    <br/>\
    <br/>\
    <textarea id='objectvalue'></textarea>\
    <br/>\
    <h2> Experience Section </h2>\
    <br\>\
    <textarea id='experiencetext'></textarea>\
    <br/>\
    <div class='internal_button' id='experience_extract_button'>Extract Work Ex</div>\
    <hr/>\
    <h2> Licenses and Certifications </h2>\
    <br/>\
    <textarea id='certificationstext'></textarea>\
    <br/>\
    <div class='internal_button' id='certification_extract_button'>Extract Certifications</div>\
    \
    <hr>\
    <h2> Skills </h3>\
    <br/>\
    <textarea id='skillstext'></textarea>\
    <br/>\
    <div class='internal_button' id='skills_extract_button'>Extract Skills</div>\
    <div id='savepdf'>Save PDF</div>\
    </div>\
    \
    \
    <!-- THE FOOTER IS HERE -->\
    <div id='sfooter'><hr/><h2>footer</h2></div>\
    ";

    //////////VARIABLES END///////////

    //expand page sections
    //expandButtons();

    //generate the DOM nodes below
    

    sliderGen(sliderInnerHTMLString);

    //DOM node generators above//


    //listener to trigger action - which is to push in/out 
    //the slider
    chrome.runtime.onMessage.addListener(function (msg, sender, sendResponse) {
      if(msg.todo == "toggle") {
        slider();
      }
    });



    //Added this as a temporary solution
    //Issue: The page doesn't fully load and content script 
    //       runs only once
    //Resolution: Added trigger through window.onscroll
    //            function to register extraction everytime
    //            a user scrolls on the webpage.
   
    data = extract();   
    var bodycontainer = document.getElementById("slider").querySelector("#sbodycontainer");
    bodycontainer = bodycontainer.querySelector("#objectvalue")
    bodycontainer.value = JSON.stringify(data)
    
    bodycontainer = document.getElementById("slider").querySelector("#sheaderheader");
    var uname = document?.querySelector('div.pv-text-details__left-panel > div > h1') || null;
    uname = uname?.textContent || "";
    bodycontainer.innerHTML = "<h1>"+uname+"</h1>";
    window.onscroll = function() {
        data = extract();
        //alert(JSON.stringify(data));
        var bodycontainer = document.getElementById("slider").querySelector("#sbodycontainer");
        bodycontainer = bodycontainer.querySelector("#objectvalue")
        bodycontainer.value = JSON.stringify(data)

        bodycontainer = document.getElementById("slider").querySelector("#sheaderheader");
        var uname = document?.querySelector('div.pv-text-details__left-panel > div > h1') || null;
        uname = uname?.textContent || "";
        bodycontainer.innerHTML = "<h1>"+uname+"</h1>";
    } 
    
  //run savePDF option
  document.getElementById('savepdf').addEventListener("click", savePDF);


  //deploying listeners for `manual extraction` buttons feature
  document.getElementById('certification_extract_button').addEventListener("click", extractCert);
  document.getElementById('skills_extract_button').addEventListener("click", extractSkills);
  document.getElementById('experience_extract_button').addEventListener("click", extractExperience);
}


//*=======================================================*//


//extract btn generator
// function extractBtnGen() {
//     var extractBtn = document.createElement("div");
//     extractBtn.textContent = "Toggle Frame";
//     extractBtn.id = "extractBtn";
//     document.querySelector("#global-nav").append(extractBtn)
// }

//slider window element generator
function sliderGen(sliderInnerHTMLString) {
    var slider = document.createElement("div");
    slider.id = "slider";
    var sliderDivInnerHTML = sliderInnerHTMLString;

    slider.innerHTML += sliderDivInnerHTML;

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
    var loc = locationElement?.textContent || null

    const photoElement = document.querySelector(".pv-top-card-profile-picture__image") || profileSection?.querySelector('.profile-photo-edit__preview')
    const photo = photoElement?.getAttribute('src') || null

    const descriptionElement = document.querySelector('div#about')?.parentElement.querySelector('.pv-shared-text-with-see-more > div > span.visually-hidden')// Is outside "profileSection"
    var description = descriptionElement?.textContent || null
        

    const url = window.location.url;
    var rawProfileData = {
        fullName,
        title,
        loc,
        photo,
        description,
        url
    }

    var profileData = {
        fullName: getCleanText(rawProfileData.fullName),
        title: getCleanText(rawProfileData.title),
        location: getCleanText(rawProfileData.loc),
        description: getCleanText(rawProfileData.description),
        photo: rawProfileData.photo,
        url: rawProfileData.url
    }
    ///extraction of profile data ends here///
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


   ///extraction of accomplishments (courses, test scores, projects,
   ///                               Languages, honor-awards)

   //first, extract out the array of nodes containing different sections
  var coursesection = document.querySelector(".courses");
  var projectsection = document.querySelector(".projects");
  var languagesection = document.querySelector(".languages");
  //var tests = acc_nodes[3]?.querySelectorAll("div > ul > li") || null;
  // var awards = acc_nodes[4]?.querySelectorAll("div > ul > li") || null;

  ///extracting different sections starting with course section

  /////COURSES/////
  var courses = []
  if(coursesection) { //if coursesection exists
    var course_nodes = coursesection.querySelectorAll("div > ul > li") || null;
    for(var nodo of course_nodes) {
      var courseName = nodo.textContent;
      courses.push(
        getCleanText(courseName)
      );
    }
  }
  /////COURSES EXTRACTION ENDS HERE/////
  
  /////PROJECTS////
  var projects = []
  if(projectsection) {
    var project_nodes = projectsection.querySelectorAll("div > ul > li") || null;
    for(var nodo of project_nodes) {
      var projectName = nodo.textContent;
      projects.push(
        getCleanText(projectName)
      );
    }
  }
  /////PROJECTS EXTRACTION ENDS HERE////


  ////LANGUAGES EXTRACTION////
  var languages = []
  if(languagesection) {
    var lang_nodes = languagesection.querySelectorAll("div > ul > li") || null;
    for(var nodo of lang_nodes) {
      var language = nodo.textContent;
      languages.push(
        getCleanText(language)
      );
    }
  }
  ////LANGUAGE EXTRACTION ENDS HERE////


  var accomplishments = {
    "courses": courses || [],
    "projects": projects || [],
    "languages": languages || []
  }

  ////Accomplishments extraction ends here


  ///VOLUNTEER EXPERIENCE EXTRACTION///
  let volunteer_experience = [];
  var volnodes = document.querySelectorAll('section.volunteering-section li');
  if(volnodes) {

    for(var nodo of volnodes) {
      var vol_title = nodo.querySelector('h3')?.textContent || null;
      var vol_company = nodo.querySelector('h4')?.textContent.replace("Company Name", "") || null;
      var vol_location = nodo.querySelector('.pv-entity__location span:nth-child(2)')?.textContent || null;
      var vol_description = nodo.querySelector('.pv-entity__extra-details')?.textContent || null;
      var date1 = nodo.querySelector('.pv-entity__date-range span:nth-child(2)')?.textContent || null;
      var date2 = nodo.querySelector('.pv-entity__bullet-item')?.textContent || null;

      volunteer_experience.push(
        {
          title: getCleanText(vol_title),
          company: getCleanText(vol_company),
          location: getCleanText(vol_location),
          description: getCleanText(vol_description),
          date1: getCleanText(date1),
          date2: getCleanText(date2)
        }
      );
    }//for-loop over volnodes
  }//if-condn to check if vonodes exists

  //add in the extracted object values here
  userProfile = {
      "profileData": profileData,
      "education": education,
      "volunteer_experience": volunteer_experience,
      "accomplishments" : accomplishments
  }

  
  return userProfile;
}//Extract() functions ends here


// Save PDF document of a linkedinProfile
function savePDF() {
  var spanList = document.getElementsByTagName("span");
  var m = [];

  for(i=0; i<spanList.length; i++)
   {
     if(spanList[i].textContent == 'Save to PDF') {
      m.push(spanList[i]);
     }
   }

   if(m.length < 1) {
    alert("No option to download profile.")
   } else {
    m[0].click();
   }

}


// Extract license and certifications
function extractCert() {
  var anchor1 = document.getElementById('licenses_and_certifications');
  var anchor2 = document.querySelector('.pvs-list');

  var list = null;
  var certs = [];
  

  if(anchor1) {
    anchor1 = anchor1.nextElementSibling.nextElementSibling
    list = anchor1.querySelector('ul').children;
  }

  if(anchor2 && document.getElementById('deepscan').checked && location.href.includes('certifications')) {
    list = anchor2.children;
  }

  if(list) { //if the anchor exists
    for(i=0; i<list.length; i++) {
      var elem = null;
      var firstdiv = null;
      var url = "";

      if(anchor1 && !document.getElementById('deepscan').checked) {
        //alert("anchor1");
        elem = list[i].firstElementChild.firstElementChild.nextElementSibling
                        .querySelectorAll('div');
        
        if(elem[0].querySelector('a')){
          firstdiv = elem[0].querySelector('a').children;
        } else {
          firstdiv = elem[1].children;
        }
        

        url = elem[4]?.querySelector('a')?.href || "";
        //if anchor1
      } 
      else if ((anchor1 == null) && anchor2 && document.getElementById('deepscan').checked  && location.href.includes('certifications')) {
        //alert("anchor2s");
        elem = list[i].querySelector('div > div').nextElementSibling;
        firstdiv = elem.firstElementChild.firstElementChild.children;

        url = elem.firstElementChild.nextElementSibling?.querySelector('a').href || "";
      } //if anchor2
      else {
        break;
      }
      
     //var condn = (firstdiv.querySelector('a'))? 'a >' : '';
     var name = getCleanText(firstdiv[0].querySelector('span > span')?.textContent || "");
     var issuedby = getCleanText(firstdiv[1].querySelector('span > span')?.textContent || "");
     var issuedon = getCleanText(firstdiv[2]?.querySelector('span > span')?.textContent || "");
     var expiration = issuedon? issuedon.split('·')[1] : "";
     var issuedon = issuedon? issuedon.split('·')[0]?.split('Issued ')[1] || "" : "";

      

      var temp = {
        'id': i,
        'title': name,
        'issuer':issuedby,
        'date':issuedon,
        'expiration': expiration,
        'link': url
      };

      certs.push(temp);

    } //for loop to scrape through the list 
  }
  var objtemp = {
    'name': 'licenses',
    'data': certs
  }

  document.getElementById('certificationstext').value = JSON.stringify(objtemp);
} //license extraction ends here


// Extract Skills 
function extractSkills() {

  //defining anchors (roots from where scraping starts)
  var anchor1 = document.getElementById("skills");
  var anchor2 = document.querySelector('.pvs-list');

  var list = null;
  var skills = [];
  
  if(anchor1 && !document.getElementById('deepscan').checked) {
    anchor1 = anchor1.nextElementSibling.nextElementSibling
    list = anchor1.querySelector('ul').children;
  }

  if(anchor2 && document.getElementById('deepscan').checked && location.href.includes('skills')) {
    list = anchor2.children;
  }

  if(list) { //if the anchor exists
    for(i=0; i<list.length; i++) {
      var elem = null;
      //var firstdiv = null;

      if(anchor1 && !document.getElementById('deepscan').checked) {
        //alert("anchor1");
        elem = list[i].firstElementChild.firstElementChild.nextElementSibling
                        .querySelectorAll('div');
        
        var index = 0;
        elem = getCleanText(elem[index]?.querySelector('div > span > span').textContent || "");
        
        
      }// anchor1 ends here
      else if ((anchor1 == null) && anchor2 && document.getElementById('deepscan').checked &&
      location.href.includes('skills')) {
        elem = list[i].querySelector('div > div').nextElementSibling;
        elem = elem.firstElementChild.firstElementChild.children;

        elem = getCleanText(elem[0]?.querySelector('div > span > span').textContent || "");

      } //anchor2 ends here
      else { //exit
        break;
      }

      skills.push(
        {
          'id': i,
          'title': elem
        }
      );
    } //for loop


  } //if `the list from anchor exists` condn ends here


  var objtemp = {
    'name': 'skills',
    'data': skills
  };

  document.getElementById('skillstext').value = JSON.stringify(objtemp);
} //Extraction of skills ends here





// Extract Experience /////

function extractExperience() {
  //defining anchors (roots from where scraping starts)
  var anchor1 = document.getElementById("experience");
  var anchor2 = document.querySelector('.pvs-list');

  var list = null;
  var exp = [];
  var roles = [];
  var company = "";

  if(anchor1 && !document.getElementById('deepscan').checked) {
    anchor1 = anchor1.nextElementSibling.nextElementSibling
    list = anchor1.querySelector('ul').children;
  } 

  if(anchor2 && document.getElementById('deepscan').checked && location.href.includes('experience')) {
    list = anchor2.children;
  } 


  
  if(list) { //if the anchor exists
    for(i=0; i<list.length; i++) {
      if(document.getElementById('deepscan').checked && !location.href.includes('experience'))
        break;
      company = "";
      roles = [];


      var elem = list[i].querySelector('div > div').nextElementSibling; //for anchor 1
      if(elem.querySelector('div > a')) {
        // condition for multiple roles in same company
        company = elem.querySelector('div > a > div > span > span')?.textContent || "";
        company = getCleanText(company);

        elem = elem.firstElementChild.nextElementSibling;
        var elems = elem.querySelector('ul').children

        for(j=0; j < elems.length; j++) {
          // traversing roles list in a company
          
          var keke = elems[j].querySelector("div > div")?.nextElementSibling || null;
          keke = keke.querySelector('div > a');

          kchilds = keke.children;
          var rname=" ", startDate=" ", endDate=" ", loc=" ";
          for(k=0; k<kchilds.length; k++) {

            //each role's details taken
            if(k==0) //role name
              rname = kchilds[k]?.querySelector('span > span').textContent || "";
            if(k==1) //role duration
              {
                var ta = kchilds[k].querySelector('span').textContent.split(/[-·]/);
                startDate = ta[0];
                endDate = ta[1];
              }
            if(k==2) //role location 
              loc= kchilds[k].querySelector('span')?.textContent || ""; 
              
           } //kloop

            roles.push({
              'id': j,
              'title': getCleanText(rname),
              'startDate': getCleanText(startDate),
              'endDate': getCleanText(endDate),
              'location': getCleanText(loc)  
            });

        } // role traversal loop


        } else { //condition when single role in one company
          elem = elem.querySelector('div > div > div > div');

          echilds = elem.children;
          var rname=" ", startDate=" ", endDate=" ", loc=" ";
          for(k=0; k<echilds.length; k++) {

            //each role's details taken
            if(k==0) //role name
              rname = echilds[k]?.querySelector('span > span').textContent || "";
            if(k==2) //role duration
              {
                var ta = echilds[k].querySelector('span').textContent.split(/[-·]/);
                startDate = ta[0];
                endDate = ta[1];
              }
            if(k==3) //role location 
              loc = echilds[k].querySelector('span')?.textContent || ""; 
            
            if(k==1) //role company title
              company = echilds[k].querySelector('span')?.textContent || "";
              if(company)
                company = company.split(/[-·]/)[0];
           } //kloop
           

           roles.push({
            'id': 0,
            'title': getCleanText(rname),
            'startDate': getCleanText(startDate),
            'endDate': getCleanText(endDate),
            'location': getCleanText(loc)  
          });



       } //single role else condn ends


       a:
       exp.push({
        'id': i,
        'company': company,
        'roles': roles
       });

      }//for loop over 'i' for each item in anchor list
  } // if list anchor exists condition

 document.getElementById('experiencetext').value = JSON.stringify(exp);
} //extract experience ends here









//////////// *---- UTILS -----* //////////////
// Utility functions

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



function getCleanText(text) {
    const regexRemoveMultipleSpaces = / +/g
    const regexRemoveLineBreaks = /(\r\n\t|\n|\r\t)/gm
  
    if (!text) return null
  
    const cleanText = text.toString()
      .replace(regexRemoveLineBreaks, '')
      .replace(regexRemoveMultipleSpaces, ' ')
      .replace('...', '')
      .replace('See more', '')
      .replace('See less', '')
      .trim()
  
    return cleanText
}


//////// * ----- UTILS ENDS -------* /////////