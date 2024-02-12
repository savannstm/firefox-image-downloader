document.addEventListener("DOMContentLoaded", async () =>
{
    const browserLang = await browser.i18n.getUILanguage();
    const selectLang = document.getElementById("lang");
    const langGotten = (await browser.storage.local.get("lang")).lang;

    switch(langGotten)
    {
        case ((!isNaN(langGotten)) || undefined):
            switch (browserLang)
            {
                case "ru": 
                    selectLang.value = "ru";
                    break;

                case "en-US":
                    selectLang.value = "en-US";
                    break;
            };
            break;

        case "ru":
            selectLang.value = "ru";
            break;

        case "en":
            selectLang.value = "en-US";
            break;
    };

    selectLang.addEventListener("change", async () =>
    {
        switch(selectLang.value)
        {
            case "ru": 
                await browser.storage.local.set({"lang": "ru"});
                location.reload();
                break;

            case "en-US":
                await browser.storage.local.set({"lang": "en"});
                location.reload();
                break;
        };
    });


    //Handle options showing/hiding
    const showOptionsLink = document.getElementById("show-options");
    const optionsDiv = document.getElementById("options");

    showOptionsLink.addEventListener("click", () =>
    {
        if (optionsDiv.style.display === "none" || optionsDiv.style.display === "")
        {
            optionsDiv.style.display = "block";
            showOptionsLink.textContent = "Hide Options";
            if (selectLang.value == "ru")
            {
                showOptionsLink.textContent = "Спрятать опции";
            };
        }
        else
        {
            optionsDiv.style.display = "none";
            showOptionsLink.textContent = "Show Options";
            if (selectLang.value == "ru")
            {
                showOptionsLink.textContent = "Показать опции";
            };
        };
    });

    //Update slider value and text
    function updateSliderValue(slider, input, attribute, output)
    {
        const value = slider.value;
        if (!isNaN(value))
        {
            input.value = value;
            if (selectLang.value == "ru")
            {       
                output.textContent = `${attribute.getAttribute("data-label")}: ${value} пикс.`;
            }
            else
            {
                output.textContent = `${attribute.getAttribute("data-label")}: ${value} px`;
            };
        };
    };

    //Send message to background.js script
    function sendMessageToBackground(active)
    {
        const minSliderInt = minSlider.value;
        const maxSliderInt = maxSlider.value;
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
    };

    //Define sliders
    const minSlider = document.getElementById("minSlider");
    const minSliderInput = document.getElementById("minSliderInput");
    const minSliderOutput = document.getElementById("minSliderValue");
    const minGotten = (await browser.storage.local.get("minStored")).minStored;

    const maxSlider = document.getElementById("maxSlider");
    const maxSliderInput = document.getElementById("maxSliderInput");
    const maxSliderOutput = document.getElementById("maxSliderValue");
    const maxGotten = (await browser.storage.local.get("maxStored")).maxStored;

    function handleSliderValue(slider)
    {
        if (slider.value > 8000)
        {
            slider.value = 8000;
        };
    };

    //Handle minimum slider
    minSliderInput.value = minSlider.value;
    if (selectLang.value == "ru")
    {
        minSliderInput.setAttribute("data-label", "Минимальный размер скачиваемых изображений");
    }
    else
    {
        minSliderInput.setAttribute("data-label", "Minimum size of downloaded pictures");
    };
    updateSliderValue(minSlider, minSliderInput, minSliderInput, minSliderOutput);

    minSlider.addEventListener("input", () =>
    {
        updateSliderValue(minSlider, minSliderInput, minSliderInput, minSliderOutput);
    });

    minSlider.addEventListener("change", () =>
    {
        if (maxSlider.value <= minSlider.value)
        {
            updateSliderValue(minSlider, maxSliderInput, maxSliderInput, maxSliderOutput);
            updateSliderValue(minSlider, maxSlider, maxSliderInput, maxSliderOutput);
        };
    });

    minSliderInput.addEventListener("input", () =>
    {
        handleSliderValue(minSliderInput);
        updateSliderValue(minSliderInput, minSlider, minSliderInput, minSliderOutput);
    });
    minSliderInput.addEventListener("blur", () =>
    {
        if (maxSliderInput.value <= minSliderInput.value)
        {
            updateSliderValue(minSliderInput, maxSliderInput, maxSliderInput, maxSliderOutput);
            updateSliderValue(minSliderInput, maxSlider, maxSliderInput, maxSliderOutput);
        };
    });


    //Handle maximum slider
    maxSliderInput.value = maxSlider.value;
    if (selectLang.value == "ru")
    {
        maxSliderInput.setAttribute("data-label", "Максимальный размер скачиваемых изображений");
    }
    else
    {
        maxSliderInput.setAttribute("data-label", "Maximum size of downloaded pictures");
    };
    updateSliderValue(maxSlider, maxSliderInput, maxSliderInput, maxSliderOutput);

    maxSlider.addEventListener("input", () =>
    {
        updateSliderValue(maxSlider, maxSliderInput, maxSliderInput, maxSliderOutput);
    });

    maxSlider.addEventListener("change", () =>
    {
        if (minSlider.value >= maxSlider.value)
        {
            updateSliderValue(maxSlider, minSliderInput, minSliderInput, minSliderOutput);
            updateSliderValue(maxSlider, minSlider, minSliderInput, minSliderOutput);
        };
    });

    maxSliderInput.addEventListener("input", () =>
    {
        handleSliderValue(maxSliderInput);
        updateSliderValue(maxSliderInput, maxSlider, maxSliderInput, maxSliderOutput);
    });
    maxSliderInput.addEventListener("blur", () =>
    {
        if (minSliderInput.value >= maxSliderInput.value)
        {
            updateSliderValue(maxSliderInput, minSliderInput, minSliderInput, minSliderOutput);
            updateSliderValue(maxSliderInput, minSlider, minSliderInput, minSliderOutput);
        };
    });


    //Handle minimum value option
    const minValue = document.getElementById("option1");
    minValue.value = 400;

    minValue.addEventListener("input", async () =>
    {
        if (!isNaN(minValue.value))
        {
            handleSliderValue(minValue);
            await browser.storage.local.set({"minStored": minValue.value});
            minSlider.value = minValue.value;
            updateSliderValue(minValue, minSliderInput, minSliderInput, minSliderOutput);
        };
    });

    minValue.addEventListener("blur", async () =>
    {
        if (minValue.value.trim() == "")
        {
            await browser.storage.local.set({"minStored": minValue.value});
            minValue.value = 400;
            minSlider.value = minValue.value;
            updateSliderValue(minValue, minSliderInput, minSliderInput, minSliderOutput);
        };
    });

    //Handle maximum value option
    const maxValue = document.getElementById("option2");
    maxValue.value = 8000;

    maxValue.addEventListener("input", async () =>
    {
        if (!isNaN(maxValue.value))
        {
            handleSliderValue(maxValue);
            await browser.storage.local.set({"maxStored": maxValue.value});
            maxSlider.value = maxValue.value;
            updateSliderValue(maxValue, maxSliderInput, maxSliderInput, maxSliderOutput);
        };
    });

    maxValue.addEventListener("blur", async () =>
    {
        if (maxValue.value.trim() == "")
        {
            await browser.storage.local.set({"maxStored": maxValue.value});
            maxValue.value = 8000;
            maxSlider.value = maxValue.value;
            updateSliderValue(maxValue, maxSliderInput, maxSliderInput, maxSliderOutput);
        };
    });

    //Handle getting values from storage
    if (!isNaN(minGotten))
    {
        updateSliderValue({value: minGotten}, minSlider, minSliderInput, minSliderOutput);
        updateSliderValue({value: minGotten}, minSliderInput, minSliderInput, minSliderOutput);
        minValue.value = minGotten;
    };

    if (!isNaN(maxGotten))
    {
        updateSliderValue({value: maxGotten}, maxSlider, maxSliderInput, maxSliderOutput);
        updateSliderValue({value: maxGotten}, maxSliderInput, maxSliderInput, maxSliderOutput);
        maxValue.value = maxGotten;
    };

    
    //Handle download buttons
    const downloadButtonWindow = document.getElementById("downloadButtonWindow");
    downloadButtonWindow.addEventListener("click", () =>
    {
        sendMessageToBackground(false);
    });

    const downloadButtonActive = document.getElementById("downloadButtonActive");
    downloadButtonActive.addEventListener("click", () =>
    {
        sendMessageToBackground(true);
    });

    const issuesMessage = document.getElementById("issues-msg");
    const option1Text = document.getElementById("option1-text");
    const option2Text = document.getElementById("option2-text");
    
    if (selectLang.value == "ru")
    {
        issuesMessage.textContent = "Если у вас возникли проблемы с этим расширением, сообщите о любых проблемах автору по электронной почте со страницы расширения Mozilla Addons.";
        downloadButtonWindow.textContent = "Скачать изображения с текущего окна";
        downloadButtonActive.textContent = "Скачать изображения с текущей вкладки";
        minSliderOutput.textContent = `Минимальный размер скачиваемых изображений: ${minSlider.value} пикс.`;
        maxSliderOutput.textContent = `Максимальный размер скачиваемых изображений: ${maxSlider.value} пикс.`;
        showOptionsLink.textContent = "Показать опции";
        option1Text.textContent = "Минимальный размер (Мин: 0, Макс: 8000)";
        option2Text.textContent = "Максимальный размер (Мин: 0, Макс: 8000)";
    };
});