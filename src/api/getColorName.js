import axios from "axios";

export async function getColorName(hex) {
    try {
        const response = await axios.get(`https://www.thecolorapi.com/id?hex=${hex.replace("#", "")}`);
        return response.data.name.value;
    } catch (err) {
        return "Unknown";
    }
}
