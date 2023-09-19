function extractImageLinks(htmlCode) 
{
    const imageLinks = [];
    
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = htmlCode;
    
    const imgElements = tempDiv.getElementsByTagName('img');
    
    for (const img of imgElements) 
    {
        const src = img.getAttribute('src');
        if (src && !src.endsWith('.gif')) 
        {
            imageLinks.push(src);
        }
    }
    
    return imageLinks;
}
async function downloadFile(url) 
{
    const downloadItem = browser.downloads.download(
    {
        url: url,
        saveAs: false,
    });
    console.log(`Downloading: ${url}`);
}


async function extractAndDownloadImagesFromTabs() 
{
    const tabs = await browser.tabs.query({currentWindow: true});

    for (const tab of tabs) 
    {
        const tabId = tab.id;

        const [result] = await browser.tabs.executeScript(tabId, { code: "document.documentElement.outerHTML" });
        const htmlCode = result;
    
        const imageLinks = extractImageLinks(htmlCode);

        for (const link of imageLinks) 
        {
            downloadFile(link)
        }
    }
}

document.addEventListener("DOMContentLoaded", function() 
{
    const downloadButton = document.getElementById("downloadButton");

    downloadButton.addEventListener("click", function() 
    {
        extractAndDownloadImagesFromTabs();
    });
});