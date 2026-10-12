# ⚡ VerbMaster Jr. - Juego de Verbos Irregulares en Inglés

Una aplicación interactiva, visual y divertida diseñada para repasar y dominar los verbos irregulares en inglés.

---

## 🚀 Cómo iniciar la aplicación

Puedes iniciarla de dos formas muy sencillas en tu Mac:

### Opción 1: Con el archivo ejecutable directo
Abre una terminal en esta carpeta y ejecuta:
```bash
./iniciar.sh
```
O simplemente haz doble clic sobre el archivo `iniciar.sh`. Se abrirá automáticamente tu navegador en `http://localhost:5173`.

### Opción 2: Con el comando habitual de desarrollo
```bash
npm run dev
```
Y abre en tu navegador: [http://localhost:5173](http://localhost:5173)

---

## 🎮 Cómo funciona el juego

1. **La Tarjeta del Verbo**:
   - Aparece el significado en español en grande (ej. **Cantar**, **Comer**, **Escribir**).
   - Dispones de **3 casillas (*blanks*)**:
     1. **Presente** (*Infinitive*, ej. `sing`)
     2. **Pasado** (*Past Simple*, ej. `sang`)
     3. **Participio** (*Past Participle*, ej. `sung`)

2. **Navegación ultrarrápida con teclado**:
   - Al pulsar la tecla **`Enter`**, el cursor salta automáticamente a la siguiente casilla.
   - En la tercera casilla, al pulsar **`Enter`** se comprueba la respuesta inmediatamente.
   - Si has acertado, con otro **`Enter`** pasas al siguiente verbo sin tener que tocar el ratón.

3. **Pronunciación Nativa por Voz**:
   - Pulsa el icono del altavoz 🔊 para escuchar la pronunciación inglesa nativa de las 3 formas.
   - Por defecto, la app pronuncia el verbo en inglés al corregir para reforzar el oído.

4. **Puntuación y Sistema de Rachas**:
   - **1 punto** por cada casilla correcta (hasta **3 puntos** por verbo).
   - Si aciertas el verbo completo varias veces seguidas, ¡se activa la **Racha (*Streak*)** con puntos multiplicadores extra!

5. **Bloques configurables**:
   - Las sesiones son de **20 en 20 verbos** por defecto.
   - En el botón de ajustes ⚙️ puedes cambiarlo a **10, 15, 20, 25, 30 o todos los verbos**.

---

## 📊 Estadísticas y Persistencia

- **Historial guardado en el navegador (`localStorage`)**: Las puntuaciones y partidas no se pierden al cerrar el navegador.
- **Detección de "Verbos Difíciles"**: La app detecta automáticamente aquellos verbos en los que haya cometido algún fallo y los añade a la sección **"Reforzar"**.
- **Botón "Repasar Fallos"**: Con un solo clic, se crea una ronda personalizada solo con los verbos que necesita practicar.
- **Muro de Medallas y Trofeos**: Desbloquea recompensas como *"Primera racha de 5"*, *"Perfección Total"*, *"Maestra de los Verbos"*, etc.

---

## 📖 Diccionario Integrado

En la pestaña **Diccionario** puede buscar cualquier verbo en español o inglés, filtrar por nivel (*Básico*, *Intermedio*, *Avanzado*), escuchar su pronunciación y leer ejemplos de oraciones reales.
