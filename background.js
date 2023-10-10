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
}

async function getImageDimensions(link)
{
    const img = new Image();

    img.src = link;
    await img.decode();
    
    const width = img.width;
    return width;
}

async function downloadImagesFromTabs(queryargument, minSliderInt, maxSliderInt)
{
    const tabs = await browser.tabs.query(queryargument);
    for await (const tab of tabs)
    {
        const tabId = tab.id;
        let results = undefined;
        try
        {
            results = await browser.scripting.executeScript(
            {
                target:
                {
                    tabId: tabId
                },
                func: () =>
                {
                    return document.documentElement.outerHTML;
                }
            });
        }
        catch (error)
        {
            console.error(error + "\nEither you have new tab or any of \'about:\' tabs opened \nOr you didn't give permission to access data for all websites at \'about:addons\'")
        }
        if (results !== undefined)
        {
            for (const result of results)
            {
                if (result !== undefined)
                {
                    const htmlCode = result.result;
                    const imageLinks = extractImageLinks(htmlCode);
                    console.log("Here's a list of all links to the images:");
                    console.log(imageLinks)
                    for (let link of imageLinks)
                    {
                        if (!link.startsWith("http://") && !link.startsWith("https://"))
                        {
                            link = "http://" + link;
                        }
                        try
                        {
                            if (await getImageDimensions(link) > minSliderInt && await getImageDimensions(link) < maxSliderInt)
                            {
                                console.log("Downloading: " + link);
                                await downloadFile(link);
                            }
                        }
                        catch (error)
                        {
                            console.log("Error while processing: " + link + " - " + error);
                        }
                        finally
                        {
                            console.log("Continuing loop...");
                        }
                    }
                }
                else
                {
                    console.warn("Looks like one of your pages doesn't contain any HTML code \nIf it happens wrongly, contact the developer using the email from firefox addons page.");
                }
            }
        }
    }
    console.log("Loop has successfully ended.")
}

browser.runtime.onMessage.addListener(function(message)
{
    if (message.action === "downloadImagesFromTabs")
    {
        const
        {
            queryargument,
            minSliderInt,
            maxSliderInt
        } = message;

        downloadImagesFromTabs(queryargument, minSliderInt, maxSliderInt);
    }
});