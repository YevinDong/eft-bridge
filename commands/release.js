const { exec } = require("shelljs");
const inquirer = require("inquirer");
const symbols = require("log-symbols");
const chalk = require("chalk");

inquirer
  .prompt([
    {
      type: "list",
      name: "selected",
      message: "请选择版本升级类型",
      choices: [
        "major",
        {
          name: "大版本更新",
          disabled: "较大版本更新时选择此项",
        },
        "minor",
        {
          name: "小版本更新",
          disabled: "较小版本更新时选择此项",
        },
        "patch",
        {
          name: "更新补丁",
          disabled: "修复bug选择此项",
        },
      ],
    },
  ])
  .then((answer) => {
    if (exec(`npm version ${answer.selected}`).code !== 0) return
    if (exec(`npm run build`).code !== 0) return
    console.log(symbols.success, chalk.green(`版本更新为${require('../package.json').version}`));
    exec('npm publish  --registry https://registry.npmjs.org')
  });
