# Yale3
 Updated and simplified version of Rekrut (Linkedin scraper for extracting profile data)

Yal§ or Yale3 (pronounced as Yal-crow) is a simplified version of [Rekrut](https://github.com/DrakenWan/Rekrut). Just enable developer mode in your `chrome://extensions` tab and click on `load unpacked` button and browse to the cloned folder. Run it on linkedin website profiles. Raw JSON profile data will be displayed on a sidebar that will appear when you click on the extension icon. Remember to scroll down slowly and click on all ["show more"](#Note-about-Show-More) buttons if any to correctly extract data.


<b>Note </b> 

Extraction Code in [Rekrut](https://github.com/DrakenWan/Rekrut) chrome extension has become obsolete due to several policy changes on linkedin website such as content policy and certain CSS and DOM design changes.
However, the server sided script can still be implemented to this day.

## Extraction

Currently able to extract:-
* - [x] `profile data` 
* - [x] `experience section` 
* - [x] `education section` 
* - [x] `certifications` 
* - [ ] `volunteer experience` 
* - [x] `skills section` 
* - [x] `accomplishments` 
  * - [x] `courses`   
  * - [x] `projects` 
  * - [x] `languages` 
  * - `test scores` _Planning not to extract these until the previous minor release [bug](https://github.com/DrakenWan/Yale3/issues/1) of accomplishment extraction is not fixed_
  * - `awards` _Same as test scores_

removed checkboxes on `test scores` and `awards` section. Planning not to extract these as the information from these is not viable unless the `accomplishments` section bug is fixed with a long term solution. For now assuming that entire `accomplishment` section has been extracted in progress.

## Note about Show More
Click on each `show more` button for each of the sections. In case of the `accomplishments` section it is strictly recommended that the user not "extend" the drop-down arrows shown besides each section. The information extracted will not be properly formatted.

## Bugs
Some bugs might have crept in. I strive to make the code as general as possible but the extractor tool may not be perfect. If you find any bug on any profile please let me know in [issues](https://github.com/DrakenWan/Yale3/issues) section.