## 实现目标

通过 command line（命令行），实现可交互的指标结果查询

## 安装前的注意事项

1. NodeJs 版本 >= 16
2. 如果是在 Windows 环境下，需要执行额外步骤。首先执行 `get-executionpolicy`，如果输出为 `RemoteSigned`，则 ok；如果输出为 `Restricted`，则继续输入 `set-executionpolicy remotesigned`，然后再次输入 `get-executionpolicy` 检查输出是否为 `RemoteSigned`。

## 安装步骤

```shell
$ git clone https://github.com:lxr599/Opendigger_CLI.git
$ sudo npm install
$ sudo npm link

安装结束后执行 opendigger -h 查看是否安装成功
```

## Usage

```shell
$ opendigger -h
Usage: index [options]

Options:
  -V, --version                 output the version number
  -r, --repo <path>             Path of the repo, <owner/repo_name>; Or specify the username, <username>
  --metric <metric>             Specify the metric, please use underscores instead of spaces; Default all
  --month <month>               Specify the month you want to query, <yyyy-MM> (default: "All")
  -d, --download <output_file>  Download the output above, specify the file path; Default false (default: false)
  -h, --help                    display help for command
```



## 实现的主要功能

- 查询**特定仓库**在**特定指标**上的数据

  格式：`opendigger --repo=xxx --metric=xxx`

  举例：

  ```shell
  $ opendigger --repo X-lab2017/open-digger --metric OpenRank
  repo.name: X-lab2017/open-digger
  repo.url: https://github.com/X-lab2017/open-digger
  openrank:
  {
    '2020-08': 4.5,
    '2020-09': 4.91,
    '2020-10': 5.59,
    '2020-11': 6.31,
    '2020-12': 9.96,
    '2021-01': 10.61,
    '2021-02': 6.28,
    '2021-03': 4.14,
    '2021-04': 4.44,
    ...
  }
  ```

- 查询**特定仓库**在**特定自然月**上在**特定指标**上的数据

  格式：`opendigger --repo = xxx --metric = xxx --month = xxx`

  举例：

  ```shell
  $ opendigger --repo X-lab2017/open-digger --month 2023-01
  repo.name: X-lab2017/open-digger
  repo.url: https://github.com/X-lab2017/open-digger
  month: 2023-01
  openrank: 19.9
  activity: 56.2
  attention: 5
  active_dates_and_times: 0,2,2,0,10,0,3,2,0,1,2,0,2,2,0,2,0,0,0,0,0,0,0,0,0,1,5,1,1,1,0,0,3,1,2,0,0,0,0,2,0,0,0,0,0,0,0,0,0,4,3,5,0,0,1,2,0,1,2,0,1,1,1,0,0,0,0,0,0,0,0,1,0,1,2,4,2,0,0,7,2,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,1,2,4,2,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,2,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,0,0,0,0,1,0,0,0,0,2,0,0,0,0,0,0,0,0,0,0
  stars: 1
  technical_fork: 2
  ...
  ```

- 查询**特定仓库**在**特定自然月份**上的**整体报告**

  格式：`opendigger --repo = xxx --month = xxx`

  举例：

  ```shell
  $ opendigger --repo X-lab2017/open-digger --month 2023-01 --metric OpenRank
  repo.name: X-lab2017/open-digger
  repo.url: https://github.com/X-lab2017/open-digger
  month: 2023-01
  openrank: 19.9
  ```

- 下载报告

  格式：在任意命令后添加 `-d` 选项，即可下载终端输出的报告

  ```shell
  $ opendigger --repo X-lab2017/open-digger --month 2023-01  -d out.json
  repo.name: X-lab2017/open-digger
  repo.url: https://github.com/X-lab2017/open-digger
  downloading report to out.json...
  openrank: 19.9
  activity: 56.2
  attention: 5
  ...
  ```

  