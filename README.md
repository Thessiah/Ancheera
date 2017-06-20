# Ancheera

A Granblue Fantasy companion Chrome extension.

# Development

In your Chrome extensions page, click "Load unpacked extension..." and point to the repo. To recompile after changes, hit the reload button beneath the extension. The styles are written with sass, so you'll need a sass compiler like compass which should watch the src folder for changes.

# Last Words

I'll try to give some background to the structure of this extension as best as I can. The code is fairly hacky due to my initial lack of js knowledge, various refactors, and unfinished features, but I will do my best to help any intrepid developers get through it.

In an ideal world I would rewrite the whole thing using libraries that I've learned how to use to clean up the code. On the front end I would scrap the sass setup completely and replace it with React and in the background scripts I would use a more functional library like functional.js or immutable.js.

Please let me know if you have any questions, or if you guys manage to create a community to actually curate and hopefully clean up this pile of shit, I would love to know about it. You can best contact me through my discord Thessiah#7593.

## General structure

There are 3 main components to the extension, with the background scripts (background.js) being the centerpiece where all of the actual logic happens. Background scripts are loaded when the user opens Chrome and persist as a single static "entity" as long as the user keeps Chrome open. 

Devtools holds all the logic that happens when the user opens their devtools and moves to the AnCheera tab. Each time the user opens a new AnCheera panel, a new instance of these devtools is generated, independent of the others.

The last is the content script, which gets placed in the page you're browsing whenever you navigate pages. It's set to only get placed in gbf pages and mainly only serves to read data that for some reason isn't trivially accessible through the xhr.

There's a 4th, smaller component which is the options page. This just manages the options page that shows up when a user selects options.

The background scripts serve as a central hub for the extension and passes messages to and from each component to communicate.

## Background Scripts

### background.js

The backbone of the whole extension and the very first thing that is loaded. On initialization, it does some version checking for patch notes and initializes the other background scripts.

Further down (where the code checks for things like message.initialize and message.devAwake), background.js handles messages that get sent to it from devpanels. Besides handling things like initializing the devpanel, this block of code handles the messages that are recieved when devpanels recieve xhr. background.js parses the url of the xhr and if it matches something that the extension needs to update based on, sends the json, url, or payload of the request to the appropriate background scripts.

### storage.js

This file handles the storage of user data. Basically for getting data, just pass in the keys and a response function, and the response function should have the result of that get. Setting data is just pass in the key and value to store. There's an example of get and set in pretty much every background script, so feel free to look at those.

AnCheera initially stored through Google Cloud something or other storage (allowing data to save between multiple computers on the same account), but I had to change it to local sotrage because the supplies json can actually exceed the amount of storage allowed and I was too lazy to write code to segment the json for storage.

### apbp.js

This handles ap bp and their associated timers. This was one of the first files I wrote so the timer logic is pretty hacky. This doesn't need to be changed much/very often since it pretty much "works perfectly fine", but ideally the code gets refactored so the timestamp of fully restored ap and bp are stored instead of their individual timers. This is because putting a computer to sleep falsifies the timers in the current implementation, while storing the final time would allow the extension to realize how much time has passed even during sleep.

### time.js

Coordinates all the timers for dailies, weeklies, ST etc. It's a lot more supurfluous now, but this was initially written mainly to manage DO and AH timers which are now defunct :') I was planning to deprecate this/convert it mostly to tooltips in the frontend since people probably don't need these timers as much anymore but I never got around to it. The actual code works fine I guess though so no real reason to change it too much.

### supplies.js

This code manages supply updates. The way I implemented it is also... passable, and I usually don't need to touch this file too much. One thing that really needs to be updated are fringe cases for supply updates, such as 4* uncaps, Siero weapon upgrades, etc. I never got around to checking the json for these events, but a handler needs to be added so the supplies get updated whenever a user does these actions.

The weapon planner info is also here mostly near the bottom. I tried to create really scalable code but I think it just turned even more noodley. Apologies to anyone who tries to decipher it. Also like half of this file is hardcoded data of the name and seqId of various supplies in the game. The purpose of all this data is if the user has not registered a supply that is necessary for the planner, the file needs to be able to get the name and seqId regardless. There's probably a better way to do this but idk. I wrote a really small script to generate this info from my own supplies but you can probably manually add any new supplies that get added later in the game's lifespan.

### quest.js

Hoo buddy this file is something else. quest.js handles reacting to things related to quests such as skipping quest next/end, storing the repeat quest, and managing the quest dailies. This is probably the most ugly file, mainly because there was a huge feature I was building in this file which I scrapped, so there are still floating fragments lying around in it.

### profile.js

Handles all the user's generic info like rank and lupis and such. Most of this is just handled through the post quest screen and the user's homepage.

### buffs.js

Probably sadly some of the cleanest code here. Just manages the journey drop buffs. No changes really need to be made here unless you want to add the ability to update buff times from the homepage, but that's only important in the fringe case where you activate buffs from a different device.

### options.js

Stores and holds info about the user's options in the background script. Usually only changes from messages that gets passed from the options page. Also I don't remember exactly why but there's a hardcoded copy of the default values for the extensions here, so be sure to update that when adding new options.

### casino.js and dailies.js

casino.js technically belongs in dailies.js but w/e. Bsaically just handling the logic for dailies; updating appropriately when dailies change and resetting when time.js calls for them to be reset. Adding new dailies is kinda annoying with the system I wrote but hopefully it's not  too archaic.

## devtools

### default.html

The big ol' html file for the devpanel. Html should be pretty straightforward so hopefully this doesn't need too much explaining.

### default.scss

The styles for the devtools; it's just one massive master stylesheet with bits and bites all over the place. Uhh yeah best of luck :\

### message.js

All the logic is here yayy. The background scripts sends 'update' messages to the devpanels and the resulting functions get called which updates the panel with jQuery(lol). That's essentially all this file does, you'll have to look at each individual function if you're looking to edit a specific functionality. Otherwise it's pretty easy to add new mutations.

### newtork.js

Parses stuff that comes through as XHR and passes it to background.js. Also posts messages to background.js from message.js

## content script

### script.js

I really hate this file and try my best to never put stuff here. If someone can figure out a better way to get the info that script.js reads from the game's UI, then please do and deprecate the content scripts completely.

Off the top of my head, the important information this script reads is profile info from the homepage, and strike time off the crew page. But yeah I usually don't update this file shrugs.



