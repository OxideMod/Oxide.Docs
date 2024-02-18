import { readdirSync, statSync } from "fs";
import { extname, join } from "path";
import matter from 'gray-matter'

export function getSidebarByPath(dirPath: string): any[] {
  // Get all files in the directory
  const unsortedFiles = getNavbarDataFromFolder(dirPath);

  // Sort the files using the after property
  const navbar = sortNavbar(unsortedFiles);

  // Format the files for vitepress
  return formatNavbar(navbar);
}

function getNavbarDataFromFolder(path: string) {
  // Get all files in the directory
  const files = readdirSync(path);

  const unsortedFiles: any[] = [];

  // Loop through all files
  for (const file of files) {
    // Get file path
    const filePath = join(path, file);
    const stat = statSync(filePath);

    // Check if it's a directory
    if (stat.isDirectory()) {
      // Get all files in the directory
      const files = getNavbarDataFromFolder(filePath);

      // Check if there's a index.md file in the directory
      const index = files.find((f) => f.link === `/${filePath.replace(/\\/g, "/").replace("docs/", "")}/index`);

      // If there is, add it to the navbar
      if (index) {
        unsortedFiles.push({
          title: index.title,
          after: index.after,
          link: index.link.replace("index", ""),
          children: files.filter((f) => f.link !== index.link),
        });
      } else {
        const niceName = file.replace(/-/g, " ").replace(/\b\w/g, l => l.toUpperCase());
        unsortedFiles.push({
          title: niceName,
          after: 0,
          children: files,
        });
      }
      // If there isn't, add all files in the directory to the navbar
    } else if (extname(file) === ".md") {
      // Get the file's details
      const details = matter.read(filePath);

      // Add the file to the navbar
      unsortedFiles.push({
        title: details.data.title,
        after: details.data.after,
        link: `/${filePath.replace(/\\/g, "/").replace("docs/", "").replace(/\.md$/, "")}`,
      });
    }
  }

  return unsortedFiles;
}

function sortNavbar(files: any[]) {
  let sortedFiles: any[] = [];

  let currentItem = files.find(item => item.after === 0 || item.after === 'index' );

  while (currentItem !== undefined) {
    sortedFiles.push(currentItem);
    
    let nextItemName = currentItem.link?.replace(/\/$/, "").split('/').pop();
    currentItem = files.find(item => item.after === nextItemName);
  }

  for (const file of sortedFiles) {
    if (file.children) {
      file.children = sortNavbar(file.children);
    }
  }

  return sortedFiles;
}

function formatNavbar(sortedFiles: any[]) {
  const navbar: any[] = [];

  // Loop through all files
  for (const file of sortedFiles) {
    // If the file has children, add them to the navbar
    if (file.children) {
      navbar.push({
        text: file.title,
        link: file.link,
        items: formatNavbar(file.children),
      });
    } else {
      // Add the file to the navbar
      navbar.push({
        text: file.title,
        link: file.link,
      });
    }
  }

  return navbar;
}