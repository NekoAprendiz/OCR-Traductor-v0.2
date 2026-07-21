const imagen = document.getElementById("imagen");
const leer = document.getElementById("boton_leer");
const resultado = document.getElementById("resultado_leer");

const traducir = document.getElementById("boton_traductor");
const traduccion = document.getElementById("traduccion_traductor");

leer.addEventListener("click", async () => {
    const archivo = imagen.files[0];

    if (!archivo) {
        alert("Selecciona una imagen");
        return;
    }
    resultado.value = "";
    
    try {

        leer.disabled = true;

        console.time("OCR");
        const datos = await Tesseract.recognize(
            archivo,
            "spa",
            {
                logger: m => {
                    resultado.value = `${m.status} ${Math.round(m.progress * 100)}%`;
                }
            }
        );
        console.timeEnd("OCR");
        resultado.value = datos.data.text;

    } 
    catch (error) {
        console.error("Error al procesar el OCR:", error);
        alert("Hubo un error al leer la imagen.");
        
    } 
    finally {
        leer.disabled = false;
       
    }
});


traducir.addEventListener("click", async () => {


    if (!resultado.value.trim()) {
        alert("Primero lee un texto para poder traducirlo.");
        return;
    }

    const partes = dividirTexto(resultado.value);
    let textoTraducido = "";
    traduccion.value = "";
    try {
       
        traducir.disabled = true;
        traducir.textContent = "Traduciendo...";
    console.time("Traduccion");
    for(const parte of partes){

        const respuesta = await fetch(
            `https://api.mymemory.translated.net/get?q=${encodeURIComponent(parte)}&langpair=en|es`
        );

        const datos = await respuesta.json();

        textoTraducido += datos.responseData.translatedText + "\n";
        
    }

    traduccion.value = textoTraducido;
   console.timeEnd("Traduccion");
}catch (error) {
    console.error("Error al traducir el texto:", error);
    alert("Ocurrió un error al intentar traducir.");

} finally {
   
    traducir.disabled = false;
    traducir.textContent = "Traducir";
}
    
});

function dividirTexto(texto, tamaño = 500) {
    const partes = [];

    for(let i = 0; i < texto.length; i += tamaño){
        partes.push(texto.slice(i, i + tamaño));
    }

    return partes;
}


const boton = document.getElementById('caja_fondo');

boton.addEventListener('click', () => {
  document.body.classList.toggle('cambiar-fondo');
  caja.classList.toggle('caja_oscuro');
  boton.classList.toggle('color');
});


const configuracion = document.getElementById('Confiicono');
const caja = document.getElementById('caja_configuracion');
let rotacionBoton = 0;
 configuracion.addEventListener('click', () => { 
  caja.classList.toggle('aparecer');
  rotacionBoton += 180;
  configuracion.style.transform = `rotate(${rotacionBoton}deg)`;

});