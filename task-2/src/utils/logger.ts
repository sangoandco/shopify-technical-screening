import chalk from "chalk";

export const logger = {
    info: (...args: any[]) => console.log(chalk.green("[INFO]:"), ...args),
    error: (...args: any[]) => console.error(chalk.red("[ERROR]:"), ...args),
};
