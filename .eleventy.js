
const { DateTime } = require("luxon");
const pluginRss = require("@11ty/eleventy-plugin-rss");
const markdownIt = require("markdown-it");
const markdownLib = markdownIt({
  html: true,
  typographer: true
});


module.exports = function (eleventyConfig) {
  // Copy CSS folder to _site
  eleventyConfig.addPassthroughCopy("css");
  eleventyConfig.addPlugin(pluginRss);

  eleventyConfig.addFilter("date", (dateObj, format = "dd LLL yyyy") => {
    return DateTime.fromJSDate(dateObj, { zone: 'utc' }).toFormat(format);
  });

  eleventyConfig.addPassthroughCopy("images");

  eleventyConfig.addPassthroughCopy("pages");

  eleventyConfig.setLibrary("md", markdownLib);

  // Create a 'posts' collection
  eleventyConfig.addCollection("posts", function (collectionApi) {
    return collectionApi.getFilteredByGlob("./posts/*.md");
  });

  eleventyConfig.addCollection("tagList", function (collection) {
    const tags = new Set();
    collection.getAll().forEach(item => {
      if (Array.isArray(item.data.tags)) {
        item.data.tags.forEach(tag => tags.add(tag));
      }
    });
    return [...tags];
  });

  eleventyConfig.addFilter("newsletterExcerpt", (content) => {
    if (!content) return "";
    // Strip HTML tags and trim
    const [beforeHr] = content.split(/<hr\s*\/?>/i);
    const plainText = beforeHr.replace(/(<([^>]+)>)/gi, "").trim();
    return plainText.split("\n").slice(1, 3).join(" ");
  });

  eleventyConfig.addFilter("excerpt", (content) => {
    if (!content) return "";
    // Strip HTML tags and trim
    const [beforeHr] = content.split(/<hr\s*\/?>/i);
    const plainText = beforeHr.replace(/(<([^>]+)>)/gi, "").trim();
    return plainText.split(".").slice(0, 3).join(".");
  });

  return {
    dir: {
      input: ".",
      includes: "_includes",
      output: "_site"
    }
  };
};
