const axios = require('axios');
const shell=require('shelljs');
const metrics=require('./metrics');

function printResult(url, repo_url, options){
    repo_url = `${repo_url}${options.repo}`
    if(options.repo){
        console.log(`respo.name: ${options.repo}\nrepo.url: ${repo_url}`)
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
                getMonthOnlyResult(url, options)
            }
        }
        
    }else{
        download(url, options, repo_url)
    }
}

function getMonthOnlyResult(url, options){  //specify repo and month without metric
    if(options.month == 'All'){
        console.error('please specify a month!')
    }else{
        const catalog=(options.repo).includes('/') ? 0 : 1;
        var returnMetrics=getMetrics(catalog)
        getUrlsResult(url, options, returnMetrics)
    }
}

async function getUrlsResult(url, options, metrics){
    for(const key in metrics){
        const value = metrics[key]
        const json_url = `${url}${value}.json`
        try{
            const response = await axios.get(json_url)
            var result = (response.data)[options.month]
            if(typeof result === 'undefined'){
                result=[]
                findKeyAndAddToJSON(response.data, options.month, result)
                console.log(`${key}: `)
                console.log(result)
                if(options.download){
                    var stringData = JSON.stringify(result)
                    shell.exec(`echo ${key}:  >> ${options.download}`)
                    shell.exec(`echo ${stringData}:  >> ${options.download}`)
                }
            }else{
                console.log(`${key}: ${result}`)
                if(options.download){
                    shell.exec(`echo "${key}: ${result}" >> ${options.download}`)
                }
            }
        }catch(error){
            console.error(`[getUrlsResult] Failed to fatch data for ${json_url}`)
        }
    }
}

function getMetrics(catalog){
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

function download(url, options, repo_url){
    shell.exec(`echo  repo.name: ${options.repo} > ${options.download}`)
    shell.exec(`echo  repo.url: ${repo_url} >> ${options.download}`)
    console.log(`downloading report to ${options.download}...`)

    if(options.metric){
        var low_case_metric = (options.metric).toLowerCase();
        url = `${url}${low_case_metric}.json`
        getJson(url).then(jsonData => {
            if(jsonData){
                var stringData = JSON.stringify(jsonData)
                if(options.month == 'All'){ //metric
                    shell.exec(`echo  ${low_case_metric}: >> ${options.download}`)
                    shell.exec(`echo ${stringData} >> ${options.download}`)
                }else{  //metric and month
                    shell.exec(`echo month: ${options.month} >> ${options.download}`)
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
            shell.exec(`echo month: ${options.month} >> ${options.download}`)
            //遍历
            getMonthOnlyResult(url, options)
        }
    }
}

function findKeyAndAddToJSON(jsonData, targetKey, resultArray) {
        for (const key in jsonData) {
            if (jsonData[key].hasOwnProperty(targetKey)) {
                const value = jsonData[key][targetKey];
                resultArray.push({ [key]: value });
            }
        }
    
}

module.exports={
    printResult:printResult,
    getRepoMonthResult:getRepoMonthResult,
    download:download,
}