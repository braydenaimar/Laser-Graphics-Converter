# Laser-Graphics-Converter
Converts GCode files into laser graphics files.


Installation
-----
#### Follow these steps to install the program.

1. Install nodejs from www.nodejs.org/en.
1. Download Git for windows from https://git-for-windows.github.io/.
2. Open Windows Command Prompt by going to the start menu and searching 'Command Prompt'.
3. Run `cd Documents` then `git init` to initialize Git in your 'Documents' folder.
4. Run `git clone https://github.com/braydenaimar/Laser-Graphics-Converter.git` to download the program into your 'Documents' folder.
5. Run `cd Laser-Graphics-Converter` to open the file.
6. Run `npm install`.
7. Run `npm start` to launch the app.

\
This is roughly what command prompt should look like after completing the above steps:
```
C:\Users\YourName>cd Documents

C:\Users\YourName\Documents>git init
Initialized empty Git repository in C:/Users/YourName/Documents/.git/

C:\Users\YourName\Documents>git clone https://github.com/braydenaimar/Laser-Graphics-Converter.git
Cloning into 'Laser-Graphics-Converter'...
~some more output~

C:\Users\YourName\Documents>cd Laser-Graphics-Converter

C:\Users\YourName\Documents\Laser-Graphics-Converter>npm install
~a whack load of output~
~note that it is normal to see some warning and error-like messages here~

C:\Users\YourName\Documents\Laser-Graphics-Converter>npm start
```

Windows Firewall may pop-up with a security alert but you just need to click `Allow Access`.

If you are having issues, you may need to add the program to the list of exclusions for Windows Defender.

#### Windows Defender Exclusion (**following steps do not apply to Windows 10 Creators Update)**

1. Select `Start` and `Settings` to open the settings window.
2. Select `Update & Security`.
3. Select `Windows Defender` in the sidebar menu on the left.
4. Under 'Exclusions' select `Add an exclusion`.
5. Under 'Folders' select `Exclude a folder`.
6. Navigate to and select to the 'Laser-Graphics-Converter' folder that you cloned from GitHub.
7. Select `Exclude this folder`.

Running the Program
-----

### Using File Explorer

1. Open Windows File Explorer.
2. Go to where you installed the program (in your 'Documents' folder if you followed the above instructions).
3. Open the 'Laser-Graphics-Converter' folder.
4. Double click 'autostart.bat' to run the program.

You may want to create a shortcut to your desktop to access it more easily.

### Using Command Prompt

1. Open Windows Command Prompt by going to the start menu and searching 'Command Prompt'.
2. Run `cd Documents/Laser-Graphics-Converter`.
3. Run `autostart.bat` to run the program.
