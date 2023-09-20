document.addEventListener("DOMContentLoaded", function()
{
    const minSlider = document.getElementById("minSlider");
    const minSliderInput = document.getElementById("minSliderInput");
    const minSliderOutput = document.getElementById("minSliderValue");
    minSlider.value = 400;
    minSliderOutput.textContent = "Minimum size of downloaded pictures: " + minSlider.value + " px";
    minSliderInput.value = minSlider.value;
    minSlider.addEventListener("input", function()
    {
        const value = minSlider.value;
        minSliderOutput.textContent = "Minimum size of downloaded pictures: " + value + " px";
        minSliderInput.value = value;
    });
    minSliderInput.addEventListener("input", function()
    {
        const value = parseInt(minSliderInput.value);
        if (!isNaN(value))
        {
            minSlider.value = value;
            minSliderOutput.textContent = "Minimum size of downloaded pictures: " + value + " px";
        }
    });
    const maxSlider = document.getElementById("maxSlider");
    const maxSliderInput = document.getElementById("maxSliderInput");
    const maxSliderOutput = document.getElementById("maxSliderValue");
    // Set the default maximum value to 8000
    maxSlider.value = 8000;
    maxSliderOutput.textContent = "Maximum size of downloaded pictures: " + maxSlider.value + " px";
    maxSliderInput.value = maxSlider.value;
    maxSlider.addEventListener("input", function()
    {
        const value = maxSlider.value;
        maxSliderOutput.textContent = "Maximum size of downloaded pictures: " + value + " px";
        maxSliderInput.value = value;
    });
    maxSliderInput.addEventListener("input", function()
    {
        const value = parseInt(maxSliderInput.value);
        if (!isNaN(value))
        {
            maxSlider.value = value;
            maxSliderOutput.textContent = "Maximum size of downloaded pictures: " + value + " px";
        }
    });

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
    async function downloadImagesFromTabs(queryargument)
    {
        const tabs = await browser.tabs.query(queryargument);
        console.log("Here's a list of all the tabs:")
        console.log(tabs)
        for await (const tab of tabs)
        {
            console.log(tab)
            const tabId = tab.id;
            const results = await browser.scripting.executeScript(
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
            console.log("Here's a results array:")
            console.log(results)
            for (const result of results)
            {
                const htmlCode = result.result;
                const imageLinks = extractImageLinks(htmlCode);
                console.log("Here's a list of all links to the images:");
                console.log(imageLinks)
                const maxSliderInt = parseInt(maxSlider.value);
                const minSliderInt = parseInt(minSlider.value);
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
        }
    }
    const downloadButtonWindow = document.getElementById("downloadButtonWindow");
    downloadButtonWindow.addEventListener("click", function()
    {
        downloadImagesFromTabs(
        {
            currentWindow: true,
        });
    });
    const downloadButtonActive = document.getElementById("downloadButtonActive")
    downloadButtonActive.addEventListener("click", function()
    {
        downloadImagesFromTabs(
        {
            active: true
        })
    })
});