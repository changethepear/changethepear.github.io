
const { DateTime } = require("luxon");
const pluginRss = require("@11ty/eleventy-plugin-rss");


module.exports = function(eleventyConfig) {
  // Copy CSS folder to _site
  eleventyConfig.addPassthroughCopy("css");
  eleventyConfig.addPlugin(pluginRss);

  eleventyConfig.addFilter("date", (dateObj, format = "dd LLL yyyy") => {
    return DateTime.fromJSDate(dateObj, { zone: 'utc' }).toFormat(format);
  });

  eleventyConfig.addPassthroughCopy("images");

  // Create a 'posts' collection
  eleventyConfig.addCollection("posts", function(collectionApi) {
    return collectionApi.getFilteredByGlob("./posts/*.md");
  });

  eleventyConfig.addCollection("tagList", function(collection) {
  const tags = new Set();
  collection.getAll().forEach(item => {
    if (Array.isArray(item.data.tags)) {
      item.data.tags.forEach(tag => tags.add(tag));
    }
  });
  return [...tags];
});

  return {
    dir: {
      input: ".",
      includes: "_includes",
      output: "_site"
    }
  };
};
