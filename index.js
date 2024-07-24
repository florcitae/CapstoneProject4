import express from "express";
import axios from "axios";
import bodyParser from "body-parser";

const app = express();
const port = 3000;
const apiKey = '05b487d0a6d94ad289bc68095a4aeeb0';

app.use(express.static('public'));
app.use(bodyParser.urlencoded({extended: true}));

//Funcion para obtener una receta aleatoria
app.get("/", async (req, res) => {
    try {
        //Llamada para obtener receta
        const url_receta = `https://api.spoonacular.com/recipes/random?apiKey=${apiKey}`;
        const result_receta = await axios.get(url_receta);
        const receta = result_receta.data.recipes[0];

        //Llamada para obtener valores nutricionales
        const url_vn = `https://api.spoonacular.com/recipes/${receta.id}/nutritionWidget.json`;
        const result_vn = await axios.get(url_vn, {
            params: {
                apiKey: apiKey
            }
        });
        const vn = result_vn.data.nutrients.slice(0,3);

        res.render("index.ejs", {
            titulo: (receta.title),
            ingrediente: (receta.extendedIngredients),
            vn: vn
        });
    } catch (error) {
        res.render("index.ejs", { receta: JSON.stringify(error) });
    }
});


app.listen(port, () => {
    console.log(`Server is running on port ${port}`)
})