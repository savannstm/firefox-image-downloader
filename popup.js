document.addEventListener("DOMContentLoaded", async function()
{
    var showOptionsLink = document.getElementById("show-options");
    var optionsDiv = document.getElementById("options");

    showOptionsLink.addEventListener("click", function() 
    {
        if (optionsDiv.style.display === "none" || optionsDiv.style.display === "") 
        {
            optionsDiv.style.display = "block";
            showOptionsLink.textContent = "Hide Options";
        } 
        else 
        {
            optionsDiv.style.display = "none";
            showOptionsLink.textContent = "Show Options";
        }
    });

    function updateSliderValue(slider, input, io, output)
    {
        const value = parseInt(slider.value);
        if (!isNaN(value))
        {
            input.value = value;
            output.textContent = `${io.getAttribute("data-label")}: ${value} px`;
        }
    }

    function sendMessageToBackground(active)
    {
        const minSliderInt = parseInt(minSlider.value);
        const maxSliderInt = parseInt(maxSlider.value);
        browser.runtime.sendMessage(
        {
            action: "downloadImagesFromTabs",
            queryargument: active ?
            {
                active: true
            } :
            {
                currentWindow: true
            },
            minSliderInt,
            maxSliderInt
        });
    }

    
    const minSlider = document.getElementById("minSlider");
    const minSliderInput = document.getElementById("minSliderInput");
    const minSliderOutput = document.getElementById("minSliderValue");
    const minGotten = (await browser.storage.local.get("minStored")).minStored
    minSlider.value = 400;
    if (!isNaN(minGotten))
    {
        minSlider.value = minGotten;
    }

    minSliderInput.value = minSlider.value;
    minSliderInput.setAttribute("data-label", "Minimum size of downloaded pictures");
    updateSliderValue(minSlider, minSliderInput, minSliderInput, minSliderOutput);

    minSlider.addEventListener("input", function()
    {
        updateSliderValue(minSlider, minSliderInput, minSliderInput, minSliderOutput);
    });

    minSliderInput.addEventListener("input", function()
    {
        if (minSliderInput.value < 0)
        {
            minSliderInput.value = 0;
        }
        if (minSliderInput.value > 8000)
        {
            minSliderInput.value = 8000
        }
        updateSliderValue(minSliderInput, minSlider, minSliderInput, minSliderOutput);
    });

    const maxSlider = document.getElementById("maxSlider");
    const maxSliderInput = document.getElementById("maxSliderInput");
    const maxSliderOutput = document.getElementById("maxSliderValue");
    const maxGotten = (await browser.storage.local.get("maxStored")).maxStored
    maxSlider.value = 8000;
    if (!isNaN(maxGotten))
    {
        maxSlider.value = maxGotten;
    }

    maxSliderInput.value = maxSlider.value;
    maxSliderInput.setAttribute("data-label", "Maximum size of downloaded pictures");
    updateSliderValue(maxSlider, maxSliderInput, maxSliderInput, maxSliderOutput);

    maxSlider.addEventListener("input", function()
    {
        updateSliderValue(maxSlider, maxSliderInput, maxSliderInput, maxSliderOutput);
    });

    maxSliderInput.addEventListener("input", function()
    {
        if (maxSliderInput.value < 0)
        {
            maxSliderInput.value = 0;
        }
        if (maxSliderInput.value > 8000)
        {
            maxSliderInput.value = 8000
        }
        updateSliderValue(maxSliderInput, maxSlider, maxSliderInput, maxSliderOutput);
    });

    const minValue = document.getElementById("option1")
    minValue.addEventListener("input", async function() 
    {
        if (!isNaN(minValue.value))
        {
            if (minValue.value < 0)
            {
                minValue.value = 0;
            }
            if (minValue.value > 8000)
            {
                minValue.value = 8000
            }
            await browser.storage.local.set({"minStored": minValue.value});
            minSlider.value = minValue.value;
            minSliderInput.value = minValue.value;
            document.getElementById("minSliderValue").textContent = `${minSliderInput.getAttribute("data-label")}: ${minValue.value} px`;
        }
    })
    if (!isNaN(minGotten))
    {
        minSlider.value = minGotten;
        minValue.value = minGotten;
    }

    const maxValue = document.getElementById("option2")
    maxValue.addEventListener("input", async function()
    {
        if (!isNaN(maxValue.value))
        {
            if (maxValue.value < 0)
            {
                maxValue.value = 0;
            }
            if (maxValue.value > 8000)
            {
                maxValue.value = 8000
            }
            await browser.storage.local.set({"maxStored": maxValue.value});
            maxSlider.value = maxValue.value;
            maxSliderInput.value = maxValue.value;
            document.getElementById("maxSliderValue").textContent = `${maxSliderInput.getAttribute("data-label")}: ${maxValue.value} px`;
        }
    })
    if (!isNaN(maxGotten))
    {
        maxSlider.value = maxGotten;
        maxValue.value = maxGotten;
    }

    const downloadButtonWindow = document.getElementById("downloadButtonWindow");
    downloadButtonWindow.addEventListener("click", function()
    {
        sendMessageToBackground(false);
    });

    const downloadButtonActive = document.getElementById("downloadButtonActive");
    downloadButtonActive.addEventListener("click", function()
    {
        sendMessageToBackground(true);
    });
});