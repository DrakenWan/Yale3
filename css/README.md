# Yale3
 Updated and simplified version of Rekrut (Linkedin scraper for extracting profile data)

Yal§ or Yale3 (pronounced as Yal-crow) is a simplified version of [Rekrut](https://github.com/DrakenWan/Rekrut). Just enable developer mode in your `chrome://extensions` tab and click on `load unpacked` button and browse to the cloned folder. Run it on linkedin website profiles. Raw JSON profile data will be displayed on a sidebar that will appear when you click on the extension icon. Remember to scroll down slowly and click on all ["show more"](#Note-about-Show-More) buttons if any to correctly extract data.

I have added a `Save PDF` option feature which is already a linkedin feature. Just able to access that feature in the extension's slider menu.

You are free to do anything with the code on the repo. Read the [license](https://github.com/DrakenWan/Yale3/blob/main/LICENSE)


<b>Note </b> 

Extraction Code in [Rekrut](https://github.com/DrakenWan/Rekrut) chrome extension has become obsolete due to several policy changes on linkedin website such as content policy and certain CSS and DOM design changes.
However, the server sided script can still be implemented to this day. I recommend using this extension however. 

## Extraction


Section Name       |      Can Extract?      | Clean?   
:----------------- | :-----------------     | :-----------------
*profile data*    |     :heavy_check_mark: | :heavy_check_mark:
*experience section*|     :heavy_check_mark: | :heavy_check_mark:
*education section*|     :x: | :x:
*certifications* |     :heavy_check_mark: | :heavy_check_mark:
*volunteer experience*|     :x: | :x:
*skills section*  |     :heavy_check_mark: | :heavy_check_mark:
*accomplishments* |     :x: | :x:  



## Bug reporting
I strive to make the code as general as possible but the extractor tool may not be perfect. If you find any bug on any profile please let me know in [issues](https://github.com/DrakenWan/Yale3/issues) section.

 **Note**: If the chrome extension hangs due to some error or bug, go to `chrome://extensions` and `update` the `Yale3` extension and referh to a new linkedin profile. THis will resolve the issue. If possible you can screenshot the error you find in the `chrome://extensions` page and report it in the issue section.

## Update Timeline

I will keep posting timed updates here. In future will shift these somewhere else if I have time


#### Update(dated: 16th August, 2022)

Added experience extraction through manual selection. Look for bugs if any. Only test on five profiles on LinkedIn. Still looking for errors by testing it on various LinkedIn profile. If I find any errors, I will fix them asap.

#### Update (dated: 15th August, 2022)

Added skills extraction. Changed the UI a bit. The UI is still ugly. If someone wants to help with it they are more than welcome.

#### Update (dated: 14th August, 2022)

I have added a button to manually extract certifications. I have not been able to get any errors using this `manual feature` on the 10 standard reference LinkedIn profiles while coding it. The manual extraction utility includes a **deepscan** feature. If a section has more than three items in its list then the user can click on *deepscan checkbox* and click on the _show more arrow_ to open the new page with the entire list of items of the section and then press the `extract {section name}` button. Experiment around with the feature and you will understand how it works. I will add this feature one-by-one for all sections for easier scraping of profile data.


#### Update (dated: 30th July, 2022)

I have migrated the manifest version from 2 to 3 for the extension. The version of Yalcrow has been changed to 2.0.0 starting from this readme commit. There are some errors that occured in doing so that I have mentioned in the description of last [commit](https://github.com/DrakenWan/Yale3/commit/af96ff1b5589b70a246e5112a0ebc4aa57cae443). But these errors do not jeopardise the extraction tool and it will still work on a linkedin profile page to extract the sections that are tickmarked in the aforementioned section.


I am going to start working on adding a few extensible features and I am going to completely change the way the extraction tool works as well. Currently, the extraction tool is initiated by scrolling the profile page but I will add buttons for each separate section to perform the extraction separately and manually at the click of a button. For now that seems to be the only possible solution in my mind to perform scraping with no conflicts.



#### Update (dated: 9th January, 2022)

LinkedIn has made drastic changes to the way profile data is loaded. I have been quite busy with work lately. Not all sections can be extracted due to major document tag changes as well as the way the profile now interacts with user actions. Clicking on  'Show More *' buttons takes you away to an entirely different document. I will try to amend this asap.

