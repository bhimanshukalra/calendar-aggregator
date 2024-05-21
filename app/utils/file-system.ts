"use server";

const fs = require("fs");

export const writeInFile = async (data: string) => {
  try {
    await fs.writeFileSync("./app/utils/tokens.txt", data);
  } catch (error) {}
};

export const readInFile = async () => {
  try {
    const data = await fs.readFileSync("./app/utils/tokens.txt", "utf8");
    return data;
  } catch (error) {
    return "";
  }
};
