var fs = require("fs"),
    readline = require("readline");

function download_selenium(URL, link) {
    const { Builder, By, Key, until, Actions } = require('selenium-webdriver');

    var driver = new Builder().forBrowser('chrome').build();

    return new Promise((resolve, reject) => {
        driver.get(URL)
            .then(() => {
                driver.findElement(By.id("video")).sendKeys(link)
                    .then(() => {
                        driver.findElement(By.id("submitbutton")).click()
                            .then(() => {
                                driver.wait(() => {
                                    return driver.executeScript('return document.readyState').then(function (readyState) {
                                        return readyState === 'complete';
                                    });
                                })
                                    .then(() => {
                                        driver.findElement(By.xpath("//table/tbody/tr[2]/td[3]/a")).click()
                                            .then(() => {
                                                driver.wait(() => {
                                                    return driver.executeScript('return document.readyState').then(function (readyState) {
                                                        return readyState === 'complete';
                                                    });
                                                })
                                                    .then(()=>{
                                                        resolve("success");
                                                    })
                                                    .catch((err)=>{
                                                        reject(err)
                                                    })

                                            })
                                    })

                            })
                    })
            })
            .catch((err) => {
                reject(err);
            })
    })

}

function file_download() {
    var video_urls = [];
    function get_video_links() {
        var file = "ttt.csv";
        var rl = readline.createInterface({
            input: fs.createReadStream(file),
            output: null,
            terminal: false
        })

        rl.on("line", function (line) {
            if (line.split(",")[9] !== "VIDEO_DOWNLOAD_URL") {
                console.log(line.split(",")[9]);
                video_urls.push(line.split(",")[9]);
            }
        });

        rl.on("close", async function () {
            var failed_urls = [];
            var tubeoffline_URL = "https://www.tubeoffline.com/download-BrightCove-videos.php";
            for (let index = 0; index < video_urls.length; index++) {
                console.log("======================Start Selenium========================");
                console.log(video_urls[index]);
                let result = await download_selenium(URL = tubeoffline_URL, link = video_urls[index]);
                if (result !== "success") {
                    console.log("------------------------------------------------------------------", result);
                    failed_urls.push(video_urls[index]);
                }
            }
        });
    }

    get_video_links();
}

file_download();