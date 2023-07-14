#!/usr/bin/env node

const program=require('commander')
const shell=require('shelljs')
const axios = require('axios')
const metrics=require('./metrics')
const utils=require('./utils')

const base_url='https://oss.x-lab.info/open_digger/github/'
const base_repo_url='https://github.com/'

program
    .version('1.0.0')
    .option('-r, --repo <path>', 'Path of the repo, <owner/repo_name>; Or specify the username, <username>')
    .option('--metric <metric>', 'Specify the metric, please use underscores instead of spaces; Default all')
    .option('--month <month>', 'Specify the month you want to query, <yyyy-MM>',validateDateFormat,'All')
    .option('-d, --download <output_file>','Download the output above, specify the file path; Default false', false)
    .parse(process.argv);

function validateDateFormat(value) {
    const regex = /^\d{4}-\d{2}$/
    if (!regex.test(value)) {
        console.error('Invalid date format! Please use yyyy-MM format.')
        program.help()
        throw new Error('Invalid date format! Please use yyyy-MM format.')
    }
    return value;
}

const options=program.opts();

utils.printResult(base_url, base_repo_url, options)

// function printResult(base_url,base_repo_url,options){
//     var repo_url = `${base_repo_url}${options.repo}`
//     if(options.repo){
//         var low_case_metric = (options.metric).toLowerCase()
//         base_url = `${base_url}${options.repo}/${low_case_metric}.json`
//         console.log(`repo.name: ${options.repo}\nrepo.url: ${repo_url}`)
//         utils.getRepoMonthResult(base_url, options, low_case_metric)
//     }else{
//         console.error('Please specify a repo!')
//         program.help()
//     }
// }

