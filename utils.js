const axios = require('axios');
const shell=require('shelljs');
const metrics=require('./metrics');

function printResult(url, repo_url, options){
    // var url = 'https://oss.x-lab.info/open_digger/github/'
    repo_url = `${repo_url}${options.repo}`
    if(options.repo){
        // var low_case_metric = (options.metric).toLowerCase();

        // url = `${url}${options.repo}/${low_case_metric}.json`

        console.log(`repo.name: ${options.repo}\nrepo.url: ${repo_url}`)
        
        getRepoMonthResult(url, options, repo_url)
    }else{
        console.error('please specify a repo!')
    }
    
}

function getRepoMonthResult(url, options, repo_url){  //specify repo ,metric and/or month
    url = `${url}${options.repo}/`
    if(!options.download){  //not download
        if(options.metric){ 
            var low_case_metric = (options.metric).toLowerCase();
            url = `${url}${low_case_metric}.json`
            getJson(url).then(jsonData => {
                if(jsonData){
                    if(options.month == 'All'){ //metric
                        console.log(`${low_case_metric}:`)
                        console.log(jsonData)
                    }else{  //metric and month
                        console.log(`month: ${options.month}`)
                        var res=jsonData[`${options.month}`]
                        console.log(`${low_case_metric}: ${res}`)
                    }
                }
            })
        }else{  //no metric
            if(options.month == 'All'){
                console.error('please specify a month!')
            }else{  //month
                console.log(`month: ${options.month}`)
                //遍历
                getMonthOnlyResult(url, options)
            }
        }
        
    }else{
        download(url, options, repo_url, options.download)
    }
}

function getMonthOnlyResult(url, options){  //specify repo and month without metric
    if(options.month == 'All'){
        console.error('please specify a month!')
    }else{
        //console.log(`month: ${options.month}`)
        //遍历
        const catalog=(options.repo).includes('/') ? 0 : 1;
        var returnMetrics=getMetrics(catalog)
        // var urls = getUrls(url, returnMetrics, catalog, options.month)
        // const fetchData = async () => {
        //     const promises = urls.map(metric_url => axios.get(metric_url).then(response=>response.data));
        //     const result = await Promise.all(promises)
        //     return result
        // };
        // console.log(fetchData)
        //console.log(returnMetrics)
        getUrlsResult(url, options, returnMetrics)
    }
}

async function getUrlsResult(url, options, metrics){
    //var typeMetrics = metrics[catalog]
    for(const key in metrics){
        const value = metrics[key]
        const json_url = `${url}${value}.json`
        //console.log(json_url)
        try{
            const response = await axios.get(json_url)
            var result = (response.data)[options.month]
            if(typeof result === 'undefined'){
                result=[]
                findKeyAndAddToJSON(response.data, options.month, result)
                console.log(`${key}: `)
                console.log(result)
                if(download){
                    var stringData = JSON.stringify(result)
                    shell.exec(`echo ${key}:  >> ${options.download}`)
                    shell.exec(`echo ${stringData}:  >> ${options.download}`)
                }
            }else{
                console.log(`${key}: ${result}`)
                if(download){
                    shell.exec(`echo "${key}: ${result}" >> ${options.download}`)
                }
            }
        }catch(error){
            console.error(`[getUrlsResult] Failed to fatch data for ${json_url}`)
        }
    }
}

function getMetrics(catalog){
    //console.log(catalog)
    var returnMetrics=metrics.opendigger_metrics[catalog]
    return returnMetrics
}

async function getJson(url){
    try {
        const response = await axios.get(url)
        return response.data
    } catch (error) {
        console.error('Wrong metric or repo! Error message: ',error.message)
        return null
    }
}

function download(url, options, repo_url, output){
    //var low_case_metric = (options.metric).toLowerCase()
    shell.exec(`echo  "repo.name: ${options.repo}\nrepo.url: ${repo_url}" > ${output}`)
    console.log(`downloading report to ${options.download}...`)

    if(options.metric){
        var low_case_metric = (options.metric).toLowerCase();
        url = `${url}${low_case_metric}.json`
        getJson(url).then(jsonData => {
            if(jsonData){
                //shell.exec(`echo  ${low_case_metric}: >> output.json`)
                var stringData = JSON.stringify(jsonData)
                if(options.month == 'All'){ //metric
                    shell.exec(`echo  ${low_case_metric}: >> ${options.download}`)
                    shell.exec(`echo ${stringData} >> ${options.download}`)
                }else{  //metric and month
                    shell.exec(`echo "month: ${options.month}" >> ${options.download}`)
                    shell.exec(`echo  ${low_case_metric}: >> ${options.download}`)
                    var res=jsonData[`${options.month}`]
                    shell.exec(`echo ${res} >> ${options.download}`)
                }
            }
        })
    }else{  //no metric
        if(options.month == 'All'){
            console.error('please specify a month!')
        }else{  //month
            shell.exec(`echo "month: ${options.month}" >> ${options.download}`)
            //遍历
            getMonthOnlyResult(url, options)
        }
    }

    // getJson(url).then(jsonData=>{
    //     if(jsonData){
    //         shell.exec(`echo  ${low_case_metric}: >> output.json`)
    //         var stringData = JSON.stringify(jsonData)
    //         if(options.month == 'All'){
    //             shell.exec(`echo ${stringData} >> output.json`)
    //         }else{
    //             var res=jsonData[`${options.month}`]
    //             shell.exec(`echo ${res} >> output.json`)
    //         }
    //     }
    // })
}

function findKeyAndAddToJSON(jsonData, targetKey, resultArray) {
    // if(jsonData.length>1){
        for (const key in jsonData) {
            if (jsonData[key].hasOwnProperty(targetKey)) {
                const value = jsonData[key][targetKey];
                resultArray.push({ [key]: value });
            }
        }
    // }else{
    //     resultArray.push(jsonData[targetKey]);
    // }
    
}

module.exports={
    printResult:printResult,
    getRepoMonthResult:getRepoMonthResult,
    download:download,
}