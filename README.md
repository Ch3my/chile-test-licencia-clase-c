# Practica test clase C Motocicletas

Bienvenido al test práctico para la clase C de Motocicletas, una herramienta diseñada para prepararte de forma estructurada y eficiente para el examen teórico. Este recurso presenta preguntas con opciones múltiples —algunas acompañadas de imágenes— y cuenta con un temporizador que simula la presión real del examen. Además, el sistema de codificación de colores te ayuda a identificar rápidamente las respuestas correctas e incorrectas, facilitando tu  auto-evaluación inmediata.

Puedes descargar el APK desde la seccion **releases**

<div style="text-align: center;">
<img src="https://github.com/user-attachments/assets/6e68bd58-23fc-4a19-84b0-32cb27e02b81" height="600">
</div>

## Caracteristicas y funcionalidades

### Presentación de preguntas y respuestas  
   La pantalla muestra una serie de preguntas. Cada pregunta puede incluir una imagen y varias opciones de respuesta. Los usuarios pueden seleccionar la opción que crean correcta, ya sea una sola opción o varias, dependiendo del tipo de pregunta.

### Temporizador ### 
   Hay un contador que muestra cuánto tiempo queda para completar el test (inicialmente 45 minutos). Cada segundo se actualiza el tiempo. Cuando se agota el tiempo, aparece un mensaje indicando que se terminó el plazo, aunque el usuario puede seguir respondiendo.

### Evaluación de respuestas y cálculo de puntuación ###  
   Al finalizar el test, la aplicación compara las respuestas seleccionadas por el usuario con las respuestas correctas de cada pregunta. Si la selección coincide exactamente con la respuesta correcta, se otorgan los puntos asignados a esa pregunta. Se suma la puntuación de todas las preguntas y se calcula el porcentaje de respuestas correctas.

###  Criterio de aprobación ###  
   Para aprobar el examen, el usuario debe obtener al menos 33 puntos. Además, se muestra el porcentaje de respuestas correctas para que el usuario pueda ver qué tan bien le fue.

### Codificación de colores al revisar el examen ###  
   Cuando se termina el test y se revisan las respuestas, se utilizan colores para facilitar la identificación de los resultados:
   - **Respuestas correctas:**  
     - Si el usuario seleccionó una respuesta correcta, esa opción se muestra con un color que indica acierto (por ejemplo, verde).  
     - Además, las respuestas que son correctas pero que no fueron seleccionadas también se resaltan con otro color (por ejemplo, azul) para indicar cuál era la opción correcta.
   - **Respuestas incorrectas:**  
     - Si el usuario seleccionó una respuesta que no es correcta, esa opción se resalta con un color que indica error (por ejemplo, rojo).

### Opciones adicionales ###  
   La interfaz también ofrece botones para "Comenzar de nuevo" (reiniciar el test) o "Revisar Test" (finalizar y ver los resultados), permitiendo al usuario controlar el flujo del examen.

## Definición de cuestionario

La informacion base se guarda en un JSON en `data/`, en el futuro podemos implementar por ejemplo el test clase B con otro JSON y darle al usuario la posibildad de elegir que test quiere, aunque esto modificaria la logica de evaluacion quizas

Otra cosa, se mantiene de manera manual un map de las imagenes de las preguntas, porque React Native necesita un import statico, no puede tener import dinamico de las imagenes. Por lo tanto al agregar nuevas preguntas con imagenes ademas de guardar la imagen en la carpeta correspondiente hay que actualizar `imageMap.js`
