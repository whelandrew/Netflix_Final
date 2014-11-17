/*  mainScript.js
    03/08/2014
    Content and UI handling for Netflix TV Interface. 
    The arrow keys can be used to navigate between the the interface objects. The enter key is used to process requests for content information and change.
*/

var position = { x: 0, y: 0 };

var navigateList =[];
var navPosition=0;
var navPrevPosition=0;
var onNavigation=true;//SIMPLE SWITCH TO TELL THE CONTROLLER IF IT IS ON THE NAVIGATION OR CONTENT PANEL

var contentList = [];
var contentImages=[];
var contentName=[];

$(document).ready(function () 
{
    tempData();

    loadNavigation();
});

function createContentPanels()//CREATE GRID LIST AND GENERATE IMAGES
{
    position.x=0;
    position.y=0;
    contentList=new Array();
    $('.contentImg').remove();
    $('.rowClass').remove();

    //GENERATE LI CACHE BASED ON THE NUMBER OF DISPLAY RESOURCES
    for(var i=0;i<contentImages[navPosition].length;i++)
    {
        var name=contentName[navPosition][i];
        if(i<4)
        {
            if(contentImages[navPosition][i]!='')
                $('#row1').append('<div class="rowClass"><li src="" class="contentImg"><div id="title'+i+'" class="contentButton"></div></li>');
        }
        else
        {
            if(contentImages[navPosition][i]!='')
                $('#row2').append('<div class="rowClass"><li src="" class="contentImg"><div id="title'+i+'" class="contentButton"></div></li>');
        }
    }
    
    //CREATE 2D ARRAY FOR CONTENT GRID
    $('.content').each(function () 
    {
        contentList.push([]);
        $('.contentImg', this).each(function () 
        {
            contentList[contentList.length - 1].push($(this));
        });
    });
    
    //CHANGE TITLE OF CONTENT HEADER
    var text=navigateList[navPosition].text();
    $('.contentHeader').text(text);
    
    processContentImages();
    
    highlightContent();
    
    onNavigation=false;
}

function loadNavigation()//SEARCH FOR ALL ELEMENTS IN THE NAVIGATION TREE
{
    navigateList.push($('#navigation0'));
    navigateList.push($('#navigation1'));
    navigateList.push($('#navigation2'));
    navigateList.push($('#navigation3'));
    
    enterKey();
}

function tempData()//FILLER DATA FOR NO-SERVER CODE
{
    contentImages[0]=['images/box art/822761.jpg','images/box art/829299.jpg','images/box art/841246.jpg','images/box art/869386.jpg','images/box art/872532.jpg','images/box art/1641134.jpg','images/box art/2091847.jpg',''];//,'images/box art/2371520.jpg'];
    contentImages[1]=['images/box art/841246.jpg','images/box art/869023.jpg','images/box art/869533.jpg','images/box art/2086307.jpg','','','',''];
    contentImages[2]=['images/box art/2325775.jpg','images/box art/2365903.jpg','images/box art/2371520.jpg','images/box art/2372627.jpg','images/box art/925010.jpg','images/box art/1585264.jpg','images/box art/841112.jpg','images/box art/830288.jpg'];
    contentImages[3]=['images/box art/841257.jpg','images/box art/868992.jpg','images/box art/869096.jpg','images/box art/869476.jpg','images/box art/869533.jpg','images/box art/872532.jpg','',''];
    
    contentName[0]=['Eternal Sunshine of The Spotless Mind','Snatch','Lie to Me',"It's Always Sunny Philadelphia",'Archer','Team America: World Police','Thor','Portlandia'];
    contentName[1]=['Lie to Me','Torchwood','Frasier','Doctor Who','','','',''];
    contentName[2]=['Johny Bravo','Breaking Bad','Portlandia','The Untouchables','Saturday Night Live: The 2010s','Lost In Translation','Star Trek: The Next Generation','The Machinist'];
    contentName[3]=['Prison Break','30 Rock','The Tudors','Burn Notice','Frasier','Archer','',''];
}

$(window).on('keydown', function (e) //LISTENER FOR HANDLING ALL KEYSTROKES
{
    $('.tooltip').remove();
    if (e.keyCode === 37) // left
        moveLeft();
    else if (e.keyCode === 38) // up
        moveUp();
    else if (e.keyCode === 39) // right
        moveRight();
    else if (e.keyCode === 40) // down
        moveDown();
    else if (e.keyCode === 13)// enter
        enterKey();
       
    clearhighlights();
    if(onNavigation)
        highlightNavigation();
    else
        highlightContent();
});

function processContentImages()//LOADS IMAGES INTO LI ELEMENT WITH URLS FROM IMAGE CACHE
{
    var i=0;
    $('.contentImg').each(function()
    {
        $(this).attr("style",'background-image:url("'+contentImages[navPosition][i]+'")');
        i++;
    });
}

function enterKey()
{
    if(onNavigation)
        createContentPanels();
    else
        loadTooltip();
}

function loadTooltip()//DISPLAY THE NAME OF SELECTED CONTENT AND POPUP ALERT OF IMAGE DIRECTORY
{
    $('.contentButton').text("");
    
    var pos=position.x;
    if(position.y>0)
        pos=position.x+4;
    
    var name=contentName[navPosition][pos];
    
    $('#title'+pos).text(name);
    alert("Image File Location : "+contentImages[navPosition][pos]);
}

function moveLeft() 
{
    if(!onNavigation)
    {
        position.x--;
        if (position.x < 0)
        {
            onNavigation=true;
            position.x = 0;
        }
    }
}

function moveUp() 
{
    if(!onNavigation)
    {
        position.y--;
        if (position.y < 0)
            position.y = 0;
    }
    else
    {
        navPrevPosition=navPosition;
        navPosition--;
        if(navPosition<0)
            navPosition=navigateList.length-1;
    }
}

function moveRight() 
{
    if(!onNavigation)
    {
        position.x++;
        if (position.x >= contentList[position.y].length)
            position.x = contentList[position.y].length - 1;
    }
    else
    {
        onNavigation=false;
        clearhighlights();
        highlightContent();
    }
}

function moveDown() 
{
    if(!onNavigation)
    {
        position.y++;
        
        if (position.y >= contentList.length || contentList[position.y].length<1)
            position.y--; 
        
        if(position.x>=contentList[position.y].length)
            position.x=contentList[position.y].length-1;
    }
    else
    {
        navPrevPosition=navPosition;
        navPosition++;
        if(navPosition>=navigateList.length)
            navPosition=0;
    }
}

function clearhighlights()
{
    navigateList[navPrevPosition].removeClass('navigationButtonActive');
    $('.contentImg').removeClass('select');
}

function highlightNavigation()
{
    clearhighlights();
    navigateList[navPosition].addClass('navigationButtonActive');
    $('.navigateButton').removeClass('disable');
}

function highlightContent() 
{
    clearhighlights();
    contentList[position.y][position.x].addClass('select');
    $('.navigateButton').addClass('disable');
}