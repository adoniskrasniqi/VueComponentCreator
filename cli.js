#!/usr/bin/env node

const [, , ...args] = process.argv;

if (!args[0]) {
	console.log("\x1b[31m", "Component name is required!");
	return;
}

const cmpName = args[0].charAt(0).toUpperCase() + args[0].slice(1);

let cmpNameFormated = cmpName.replace(
	/([A-Z])/g,
	g => `-${g[0].toLowerCase()}`
);

if (cmpNameFormated.substr(0, 1) === "-") {
	cmpNameFormated = cmpNameFormated.substring(1);
}

const execSync = require("child_process").execSync;

const encoding = { encoding: "utf-8" };

try {
	execSync(`mkdir ${cmpName}`, encoding);
} catch (e) {
	console.log("\x1b[31m", "Existing files are not modified!");
	return;
}

const htmlTemplate = `{ 
	echo '<section class="${cmpNameFormated}">
	<h1>${cmpName} Component</h1>
</section>' 
}`;

const scssTemplate = `{
	echo '.${cmpNameFormated} {
}'
}`;

const vueTemplate = `{
  echo '<template src="./${cmpName}.html"></template>'
  echo '<script src="./${cmpName}.js"></script>'
  echo '<style src="./${cmpName}.scss" lang="scss"></style>'
}`;

const jsTemplate = `
 {
	echo 'export default {
	name: "${cmpNameFormated}",
	components: {},
	props: [],
	data() {
		return {};
	},
	computed: {},
	mounted() {},
	methods: {}
};';
}`;

execSync(
	`
 	${htmlTemplate} >> ${cmpName}/${cmpName}.html;
 	${scssTemplate} >> ${cmpName}/${cmpName}.scss;
	${vueTemplate} >> ${cmpName}/index.vue;
 	${jsTemplate} >> ${cmpName}/${cmpName}.js;
 	`,
	encoding
);
console.log("\x1b[32m", `VueJS component created!`);
