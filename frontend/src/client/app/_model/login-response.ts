import { Empresa } from './empresa'; 
import { Usuario } from './usuario'; 
import { Modulo } from './modulo'; 

export class LoginResponse {
    
    username: Empresa;
    usuario: Usuario;
    modulos: Modulo[];

    constructor(usuario: Usuario, modulos: Modulo[], franquia: Empresa){
        this.usuario = usuario;
        this.modulos = modulos;        
    }
}