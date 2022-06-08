import { create } from "twrnc";

// create the customized version...
const tw2 = create(require(`./tailwind.config.js`)); // <- your path may differ

// ... and then this becomes the main function your app uses
export default tw2;
