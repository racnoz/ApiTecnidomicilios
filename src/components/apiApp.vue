<template>
    
    <h2 v-if="consultarActivo">Listado de técnicos</h2>
    <button v-if="consultarActivo" @click="toggleActive('tecnicos')">Consultar técnicos</button>
    <div v-if="activeElement === 'tecnicos'">
        <h2>Listado de técnicos</h2>
        <ul>
            <li v-for="tecnico in tecnicos" :key="tecnico.id">
                {{tecnico}}
            </li>
        </ul>
    </div>

    <h2 v-if="consultarActivo">Ingresar técnico</h2>
    <button v-if="consultarActivo" @click="toggleActive('ingresar')">Ejecutar</button>
    <div v-if="activeElement === 'ingresar'">
        <h2>Ingresar técnico</h2>
        <form action="">
        <div>
            <input v-model="techForm.email" type="email" placeholder="Correo electrónico" required>
        </div>
        <br>
        <div>
            <input v-model="techForm.password" type="password" placeholder="Contraseña" required>
        </div>
        <br>
        <div>
            <input v-model="techForm.nombre" type="text" placeholder="Nombre y Apellido" required>
        </div>
        <br>
        <div>
            <input v-model="techForm.telefono" type="text" placeholder="Celular" required>
        </div>
        <br>
        <div>
            <input v-model="techForm.direccion" type="text" placeholder="Dirección" required>
        </div>
        <br>
        <div>
            <input v-model="techForm.compania" type="text" placeholder="Compañía" required>
        </div>
        <br>
        <div>
            <input v-model="techForm.experiencia" type="number" placeholder="Experiencia" required>
        </div>

    </form>
    <br>
    <button @click="enviarDatos">Enviar datos</button>
    </div>

    
    

    <h2 v-if="consultarActivo">Buscar técnico por email</h2>
    <button v-if="consultarActivo" @click="toggleActive('buscar')">Ejecutar</button>
    <br>
    <div v-if="activeElement === 'buscar'">
        <h2>Buscar técnico por email</h2>
        <input v-model="email" type="email" placeholder="Correo electrónico">
        <button @click="consultarTecnico">Consultar</button>
        <br>
        <span >{{tecnico}}</span>
    </div>
    
    <h2 v-if="consultarActivo">Eliminar técnico</h2>
    <button v-if="consultarActivo" @click="toggleActive('eliminar')">Ejecutar</button>
    <br>
    <div v-if="activeElement === 'eliminar'">
        <h2>Eliminar técnico</h2>
        <input v-model="email" type="email" placeholder="Correo electrónico">
        <button @click="eliminarTecnico">Eliminar</button>
        <h3 v-if="resp">Técnico eliminado</h3>
    </div>

    <br>
    <button @click="nuevaConsulta">Nueva Consulta</button>
    

</template>

<script>
import {ref} from 'vue'
import {collection, getDocs, addDoc, query, where, deleteDoc} from 'firebase/firestore/lite'

import {FirebaseDB}  from '../firebase/config'


export default {
    setup(){

        const techForm = ref({
        compania: '',
        direccion: '',
        email: '',
        experiencia: '',
        nombre: '',
        password: '',
        telefono: '',
        foto: "URL",
        habilidades: ["Plomeria", "Gas", "Instalación"],
        })

        const email = ref('')
        const tecnico = ref('')
        const consultarActivo = ref(true)
        const activeElement = ref(null)
        
        const tecnicos = ref([])

        let resp = ref(false)
        const obtenerDatos = async() => {

            try {
                const tecnicosRef = collection(FirebaseDB, 'tecnicos')
                const querySnapshot = await getDocs(tecnicosRef)
                tecnicos.value = querySnapshot.docs.map((doc) =>({
                    id: doc.id,
                    ...doc.data()
            }))    
            } catch (error) {
                console.error("Error al obtener técnico por email:", error)
            }
            

        }

        const enviarDatos = async() =>{
            try {
                if (techForm.value.email === '') {
                    window.alert('Por favor, complete todos los campos obligatorios.')
                    return
                }
                const docRef = await addDoc(collection(FirebaseDB, "tecnicos"), {
                    compania: techForm.value.compania,
                    direccion: techForm.value.direccion,
                    email: techForm.value.email,
                    experiencia: techForm.value.experiencia,
                    foto: techForm.value.foto,
                    habilidades: techForm.value.habilidades,
                    nombre: techForm.value.nombre,
                    password: techForm.value.password,
                    telefono: techForm.value.telefono,

                    
                });
                console.log("Document written with ID: ", docRef.id);
            } catch (e) {
                console.error("Error adding document: ", e);
            }
        }
        
        const obtenerTecnicoPorEmail = async (email) => {

            try {

                const tecnicosRef = collection(FirebaseDB, 'tecnicos');
                const q = query(tecnicosRef, where("email", "==", email));
                const querySnapshot = await getDocs(q);
                if (!querySnapshot.empty) {
                    tecnico.value = querySnapshot.docs.map(doc => ({
                        id: doc.id,
                        data: doc.data()
                    }))[0];
                } else {
                    console.log("No se encontró ningún técnico con el correo electrónico proporcionado.");
                    tecnico.value = null
                }
            } catch (error) {
                console.error("Error al obtener técnico por email:", error);
            }
        }

        const borrarTecnicoPorEmail = async (email) => {
            try {
                const tecnicosRef = collection(FirebaseDB, 'tecnicos')
                const q = query(tecnicosRef, where("email", "==", email))
                const querySnapshot = await getDocs(q)
                querySnapshot.forEach(async (doc) => {
                    await deleteDoc(doc.ref)
                })
                return resp.value = true
            } catch (error) {
                console.error("Error al borrar técnico por email:", error)
                return resp.value
            }
        }

        obtenerDatos()
        const consultarTecnico = async () => {
            await obtenerTecnicoPorEmail(email.value)
        }
        
        const eliminarTecnico = async () => {
            await borrarTecnicoPorEmail(email.value)
        }

        const toggleActive = (element) => {
            activeElement.value = activeElement.value === element ? null : element;
            if (activeElement.value !== null) consultarActivo.value = false
        }

        const nuevaConsulta = () =>{
            consultarActivo.value = true
            activeElement.value = null
        }
        
        return{
            techForm,
            email,
            tecnico,
            resp,
            consultarActivo,
            activeElement,


            tecnicos,
            enviarDatos,
            eliminarTecnico,
            consultarTecnico,
            toggleActive,
            nuevaConsulta

        }
    }

}
</script>


<style>

</style>