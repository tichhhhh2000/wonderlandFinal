import { Injectable } from '@angular/core';
import { SQLite, SQLiteObject } from '@awesome-cordova-plugins/sqlite/ngx';
import { Platform } from '@ionic/angular';
import { BehaviorSubject, Observable, Subject} from 'rxjs';
import { Roles } from '../modules/roles';
import { AlertServiceService } from './alert-service.service';
import { Usuarios } from '../modules/usuarios';
import { Productos } from '../modules/productos';
import { Carrito } from '../modules/carrito';
import { outputAst } from '@angular/compiler';
import { Favoritos } from '../modules/favoritos';


@Injectable({
  providedIn: 'root'
})
export class ServicebdService {

  //variable de conexión a la Base de Datos
  public database!: SQLiteObject;
  private stockCambiado = new Subject<void>(); // Nueva variable para eventos de stock

  // Observable al que los componentes se pueden suscribir
  stockCambiado$ = this.stockCambiado.asObservable();

  //variables de creación de tablas
  tablaRol: string = "CREATE TABLE IF NOT EXISTS tablaRol(id_rol INTEGER PRIMARY KEY AUTOINCREMENT, nombre_rol VARCHAR(100) NOT NULL);";

  tablaUsuario: string = "CREATE TABLE IF NOT EXISTS tablaUsuario(id_usuario INTEGER PRIMARY KEY AUTOINCREMENT, usuario VARCHAR(100) NOT NULL, clave_usuario VARCHAR(100) NOT NULL, correo_usuario VARCHAR(100) NOT NULL, direccion VARCHAR(200), foto_perfil TEXT, id_rol INTEGER, FOREIGN KEY(id_rol) REFERENCES tablaRol(id_rol));";

  tablaVenta: string = "CREATE TABLE IF NOT EXISTS tablaVenta(id_venta INTEGER PRIMARY KEY AUTOINCREMENT, fecha_venta DATE NOT NULL DEFAULT (datetime('now', 'localtime')), total_venta INTEGER NOT NULL, id_usuario INTEGER, FOREIGN KEY(id_usuario) REFERENCES tablaUsuario(id_usuario) ON DELETE CASCADE);";



  tablaArticuloVenta: string = "CREATE TABLE IF NOT EXISTS tablaArticuloVenta(id_articuloVenta INTEGER PRIMARY KEY AUTOINCREMENT, id_venta INTEGER NOT NULL, id_album INTEGER NOT NULL, cantidad INTEGER NOT NULL, FOREIGN KEY(id_venta) REFERENCES tablaVenta(id_venta) ON DELETE CASCADE, FOREIGN KEY (id_album) REFERENCES tablaProducto(id_album) ON DELETE CASCADE);";


  tablaProducto: string = "CREATE TABLE IF NOT EXISTS tablaProducto(id_album INTEGER PRIMARY KEY AUTOINCREMENT, nombre_artista VARCHAR(100) NOT NULL, nombre_album VARCHAR(100) NOT NULL, precio_album INTEGER NOT NULL, detalle_album TEXT, portada_album TEXT,stock INTEGER DEFAULT 0);";

  tablaCarrito: string = "CREATE TABLE IF NOT EXISTS tablaCarrito(id_carrito INTEGER PRIMARY KEY AUTOINCREMENT, cantidad INTEGER DEFAULT 1, id_album INTEGER NOT NULL, id_usuario INTEGER NOT NULL, FOREIGN KEY(id_usuario) REFERENCES tablaUsuario(id_usuario), FOREIGN KEY(id_album) REFERENCES tablaProducto(id_album));";

  tablaFavorito: string = "CREATE TABLE IF NOT EXISTS tablaFavorito(id_favorito INTEGER PRIMARY KEY AUTOINCREMENT, id_usuario INTEGER, id_album INTEGER, FOREIGN KEY(id_usuario) REFERENCES tablaUsuario(id_usuario), FOREIGN KEY (id_album) REFERENCES tablaProducto(id_album));";


  //variables de insert por defecto en la bd  
  registroUsuario: string = "INSERT OR IGNORE INTO tablaUsuario(usuario, clave_usuario, correo_usuario, direccion, foto_perfil, id_rol) VALUES('admin', 'Fate123', 'admin@wonderland.cl', NULL, NULL, 1)";

  registroRol: string = "INSERT OR IGNORE INTO tablaRol(id_rol,nombre_rol) VALUES(1,'Administrador'),(2,'Cliente')";

  registroVenta: string = "INSERT OR IGNORE INTO tablaVenta(id_venta, fecha_venta, total_venta) VALUES (NULL, datetime('now', 'localtime'), 0);";

  registroEstadoVenta: string = "INSERT OR IGNORE INTO tablaEstadoVenta(id_estado, nombre_estado) VALUES (1, 'Pendiente'), (2, 'Completado');";
  

  registroProducto: string = `
  INSERT OR IGNORE INTO tablaProducto (nombre_artista, nombre_album, precio_album, detalle_album, portada_album, stock) VALUES
  ('BTS', 'Wings', 21990, 'Incluye: Photocard, póster, CD, libro de letras', NULL, 20),
  ('V', 'Layover', 16990, 'Incluye: Photocard, póster, sticker', NULL, 20),
  ('BTS', 'Proof', 79990, 'Incluye: 3 CDs, photobook, mini póster, photocards', NULL, 20),
  ('BTS', 'Butter', 26990, 'Incluye: Photocard, póster, stickers', NULL, 20),
  ('BTS', 'Love Yourself Her', 23990, 'Incluye: Photocard, póster, libro de letras', NULL, 20),
  ('BTS', 'Love Yourself Tear', 23990, 'Incluye: Photocard, póster, libro de letras', NULL, 20),
  ('BTS', 'Love Yourself Answer', 24990, 'Incluye: 2 CDs, photocard, póster', NULL, 20),
  ('BTS', 'Map Of The Soul 7', 31990, 'Incluye: Photocard, póster, stickers, photobook', NULL, 20),
  ('JIN', 'The Astronaut', 23990, 'Incluye: Photocard, póster, stickers', NULL, 20),
  ('Agust D', 'D-DAY', 25990, 'Incluye: Photocard, póster, libro de letras', NULL, 20),
  ('JIMIN', 'FACE', 26990, 'Incluye: Photocard, póster, libro de letras', NULL, 20),
  ('J-Hope', 'Jack In The Box', 24990, 'Incluye: Photocard, póster, libro de letras', NULL, 20),
  ('JungKook', 'Golden', 29990, 'Incluye: Photocard, póster, stickers', NULL, 20),
  ('JIMIN', 'Muse', 29990, 'Incluye: Photocard, póster, stickers', NULL, 20),
  ('BTS', 'Are You Late Too [O!RUL8,2]', 23990, 'Incluye: Photocard, póster, libro de letras', NULL, 20),
  ('BTS', '2 COOL 4 SKOOL', 17990, 'Incluye: Photocard, póster, stickers', NULL, 20),
  ('BTS', 'Dark & Wild', 25990, 'Incluye: Photocard, póster, libro de letras', NULL, 20),
  ('BTS', 'Map Of The Soul Persona', 24990, 'Incluye: Photocard, póster, stickers', NULL, 20),
  ('BTS', 'Skool Luv Affair', 23990, 'Incluye: Photocard, póster, stickers', NULL, 20),
  ('BTS', 'The Most Beautiful Moment in Life PT.1', 20990, 'Incluye: Photocard, póster, stickers', NULL, 20),
  ('BTS', 'The Most Beautiful Moment in Life PT.2', 20990, 'Incluye: Photocard, póster, stickers', NULL, 20),
  ('RM', 'Indigo', 26990, 'Incluye: Photocard, póster, stickers', NULL, 20),
  ('ATEEZ', 'Golden Hour Part.1', 29990, 'Incluye: Photocard, póster, libro de letras', NULL, 20),
  ('ATEEZ', 'The World Ep.Fin : Will', 27990, 'Incluye: Photocard, póster, stickers', NULL, 20),
  ('ATEEZ', 'The World Ep.2 : Outlaw', 28990, 'Incluye: Photocard, póster, stickers', NULL, 20),
  ('ATEEZ', 'The World Ep.1 : Movement', 27990, 'Incluye: Photocard, póster, stickers', NULL, 20),
  ('ATEEZ', 'Zero : Fever Part.1', 32990, 'Incluye: Photocard, póster, libro de letras', NULL, 20),
  ('ATEEZ', 'Zero : Fever Part.2', 29990, 'Incluye: Photocard, póster, stickers', NULL, 20),
  ('ATEEZ', 'Zero : Fever Part.3', 29990, 'Incluye: Photocard, póster, stickers', NULL, 20),
  ('ATEEZ', 'Beyond : Zero (Limited Edition)', 40990, 'Incluye: Photocard, póster, stickers', NULL, 20),
  ('MINGI', '(Pre-Venta) Fix On / Off', 64990, 'Incluye: Photocard, póster, edición limitada', NULL, 20),
  ('ATEEZ', 'Treasure Ep.1 : All To Zero', 20990, 'Incluye: Photocard, póster, libro de letras', NULL, 20),
  ('ATEEZ', 'Treasure Ep.2 : Zero To One', 24990, 'Incluye: Photocard, póster, stickers', NULL, 20),
  ('ATEEZ', 'Treasure Ep.3 : One To All', 17990, 'Incluye: Photocard, póster, stickers', NULL, 20),
  ('ATEEZ', 'Treasure Ep.Fin : All To Action', 20990, 'Incluye: Photocard, póster, libro de letras', NULL, 20),
  ('ENHYPEN', 'Romance : Untold', 28990, 'Incluye: Photocard, póster, stickers', NULL, 20),
  ('ENHYPEN', 'Orange Blood', 26990, 'Incluye: Photocard, póster, stickers', NULL, 20),
  ('ENHYPEN', 'Dark Blood', 27990, 'Incluye: Photocard, póster, stickers', NULL, 20),
  ('ENHYPEN', 'Border : Day One', 31990, 'Incluye: Photocard, póster, stickers', NULL, 20),
  ('ENHYPEN', 'Dimension : Dilema', 16990, 'Incluye: Photocard, póster, stickers', NULL, 20),
  ('ENHYPEN', 'Memorabilia', 31990, 'Incluye: Photocard, póster, stickers', NULL, 20);
`;



  //variables para guardar los registros resultantes de los select
  listadoUsuario = new BehaviorSubject([]);

  listadoProducto = new BehaviorSubject([]);

  usuarioUnico = new BehaviorSubject([]);

  listadoCarrito = new BehaviorSubject([]);

  listadoFavorito = new BehaviorSubject([]);




  //variable para manipular el estado de la Base de Datos (solo se crea UNA variable de este tipo)
  private idDBReady: BehaviorSubject<boolean> = new BehaviorSubject(false);

  constructor(private sqlite: SQLite, private platform: Platform, private alerta: AlertServiceService) { 
    this.crearBD();
  }

   // Método para emitir cambios de stock
   emitirCambioStock() {
    this.stockCambiado.next();
  }

  //funciones de retorno de observables
  fetchUsuario(): Observable<Usuarios[]> {
    return this.listadoUsuario.asObservable();
  }

  fetchUsuarioUnico(){
    return this.usuarioUnico.asObservable();
  }

  fetchProducto(): Observable<Productos[]> {
    this.listadoProducto.subscribe(items => {
      console.log('Productos obtenidos:', items); // Verifica que cada producto tenga stock
    });
    return this.listadoProducto.asObservable();
  }
  

  fetchCarrito(): Observable<Carrito[]> {
    return this.listadoCarrito.asObservable()
  }

  fetchFavoritos(): Observable<Favoritos[]> {
    return this.listadoFavorito.asObservable()
  }
  

  //val observable de la bd
  dbState() {
    return this.idDBReady.asObservable();
  }


  // el chat recomienda agregar async y await
  crearBD() {
    this.platform.ready().then(() => {
      this.sqlite.create({
        name: 'Wonderland46.db',
        location: 'default'
      }).then((db: SQLiteObject) => {
        this.database = db;
        this.creartablas();
        this.idDBReady.next(true);
      }).catch(e => {
        this.alerta.GenerarAlerta("Creacion de BD", "error creando la BD: " + JSON.stringify(e))
      });
    });
  }

  async creartablas() {
    try {
        await this.database.executeSql(this.tablaRol, []);

        await this.database.executeSql(this.registroRol, []);

        await this.database.executeSql(this.tablaUsuario, []);

        await this.database.executeSql(this.registroUsuario, []);

        await this.database.executeSql(this.tablaProducto, []);

        await this.database.executeSql(this.tablaCarrito, []);

        await this.database.executeSql(this.tablaFavorito, []);

        await this.database.executeSql(this.tablaVenta, []);

        await this.database.executeSql(this.tablaArticuloVenta, []);
        
        // Inserciones por defecto
        
        console.log('Se añadieron los album')
        const albumExiste = await this.database.executeSql('SELECT COUNT(*) FROM tablaProducto', []);

        if(albumExiste.rows.item(0)['COUNT(*)'] === 0) {
          await this.database.executeSql(this.registroProducto, []);
        } else {
          console.log('Ya no se crearán datos nuevos de productos')
        }

    } catch (e) {
        this.alerta.GenerarAlerta("Creacion de tabla", "Error creando las tablas: " + JSON.stringify(e));
    }
}

  // USUARIO
  consultarUsuario(usuario: string, clave: string) {
    return this.database.executeSql('SELECT * FROM tablaUsuario WHERE usuario = ? AND clave_usuario = ?', [usuario, clave]).then(res => {
      let usuario = null;
      if(res.rows.length > 0) {
        usuario = {
          id_usuario: res.rows.item(0).id_usuario,
          usuario: res.rows.item(0).usuario,
          clave_usuario: res.rows.item(0).clave_usuario,
          correo_usuario: res.rows.item(0).correo_usuario,
          direccion: res.rows.item(0).direccion,
          id_rol: res.rows.item(0).id_rol
        }
      }
      return usuario;
    }).catch(e=> {
      this.alerta.GenerarAlerta('Error', 'Error en consulta de usuario: ' + JSON.stringify(e))
      return null;
    }) 
  }

  insertarUsuario(usuario: string, correo: string, password: string, direccion: string) {
    return this.database.executeSql('INSERT INTO tablaUsuario (usuario, clave_usuario, correo_usuario, direccion, foto_perfil, id_rol) VALUES (?,?,?,?,NULL,2)', [usuario, password, correo, direccion])
  }

  verificarUsuarioCorreo(usuario: string, correo: string) {
    return this.database.executeSql('SELECT * FROM tablaUsuario WHERE usuario = ? AND correo_usuario = ?', [usuario, correo]).then(res=>{
      return res.rows.length > 0 
    }).catch(e=> {
      this.alerta.GenerarAlerta('Error', 'Error en verificar usuario o correo' + JSON.stringify(e))
      return false;
    })
  }

  modificarUsuario(id_usuario: number, usuario: string, clave: string, correo: string, direccion: string) {
    return this.database.executeSql(
      'UPDATE tablaUsuario SET usuario = ?, clave_usuario = ?, correo_usuario = ?, direccion = ? WHERE id_usuario = ?', 
      [usuario, clave, correo, direccion, id_usuario]
    ).then(res => {
      return res.rowsAffected > 0;  // Devuelve true si la modificación fue exitosa
    }).catch(e => {
      this.alerta.GenerarAlerta('Error', 'Error en la modificación del usuario: ' + JSON.stringify(e));
      return false;
    });
  }

  eliminarUsuario(id_usuario: number) {
    return this.database.executeSql(
      'DELETE FROM tablaUsuario WHERE id_usuario = ?', 
      [id_usuario]
    ).then(res => {
      return res.rowsAffected > 0;  // Devuelve true si la eliminación fue exitosa
    }).catch(e => {
      this.alerta.GenerarAlerta('Error', 'Error al eliminar el usuario: ' + JSON.stringify(e));
      return false;
    });
  }

  //PRODUCTO
  consultarProducto() {
    return this.database.executeSql('SELECT * FROM tablaProducto', []).then(res => {
      let items: Productos[] = [];
      if (res.rows.length > 0) {
        for (let i = 0; i < res.rows.length; i++) {
          items.push({
            id_album: res.rows.item(i).id_album,
            nombre_artista: res.rows.item(i).nombre_artista,
            nombre_album: res.rows.item(i).nombre_album,
            precio_album: res.rows.item(i).precio_album,
            detalle_album: res.rows.item(i).detalle_album,
            portada_album: res.rows.item(i).portada_album,
            stock: res.rows.item(i).stock || 0  // Asegurar stock inicializado
          });
        }
      }
      this.listadoProducto.next(items as any);
    }).catch(e => {
      console.error('Error al consultar productos:', e);
    });
  }
  
  

  
  insertarProducto(nombre_artista: string, nombre_album: string, detalle_album: string, precio_album: number, portada_album: string | null) {
    return this.database.executeSql(
      'INSERT INTO tablaProducto (nombre_artista, nombre_album, detalle_album, precio_album, portada_album) VALUES (?, ?, ?, ?, ?)', 
      [nombre_artista, nombre_album, detalle_album, precio_album, portada_album]
    ).then(res => {
      return res.rowsAffected > 0;  // Devuelve true si la inserción fue exitosa
    }).catch(e => {
      this.alerta.GenerarAlerta('Error', 'Error al insertar producto: ' + JSON.stringify(e));
      return false;
    });
  }
  
  // tablaProducto: string = "CREATE TABLE IF NOT EXISTS tablaProducto(id_album INTEGER PRIMARY KEY AUTOINCREMENT, nombre_artista VARCHAR(100) NOT NULL, nombre_album VARCHAR(100) NOT NULL, precio_album INTEGER NOT NULL, detalle_album TEXT, portada_album TEXT);";
  
  verificarProducto(nombre_album: string, precio_album: number) {
    return this.database.executeSql('SELECT * FROM tablaProducto WHERE nombre_album = ? AND precio_album = ?', [nombre_album, precio_album]).then(res => {
      return res.rows.length > 0;  // Devuelve true si el producto existe
    }).catch(e => {
      this.alerta.GenerarAlerta('Error', 'Error al verificar producto: ' + JSON.stringify(e));
      return false;
    });
  }
  

  
  modificarProducto(
  id_album: number,
  nombre_artista: string,
  nombre_album: string,
  detalle_album: string,
  precio_album: number,
  portada_album: string | null,
  stock: number
) {
  return this.database.executeSql(
    'UPDATE tablaProducto SET nombre_artista = ?, nombre_album = ?, detalle_album = ?, precio_album = ?, portada_album = ?, stock = ? WHERE id_album = ?',
    [nombre_artista, nombre_album, detalle_album, precio_album, portada_album, stock, id_album]
  ).then(res => {
    return res.rowsAffected > 0; // Verificar si la modificación fue exitosa
  }).catch(e => {
    console.error('Error al modificar el producto:', e);
    return false;
  });
}

  
  

  
  eliminarProducto(id_album: number) {
    return this.database.executeSql(
      'DELETE FROM tablaProducto WHERE id_album = ?',
      [id_album]
    ).then(res => {
      return res.rowsAffected > 0;  // Devuelve true si la eliminación fue exitosa
    }).catch(e => {
      this.alerta.GenerarAlerta('Error', 'Error al eliminar producto: ' + JSON.stringify(e));
      return false;
    });
  }  
  

  traerUsuario(idUsuario: number) {
    return this.database.executeSql(
      'SELECT usuario, correo_usuario, direccion, foto_perfil FROM tablaUsuario WHERE id_usuario = ?;', 
      [idUsuario]
    ).then(res => {
      if (res.rows.length > 0) {
        const usuario = {
          usuario: res.rows.item(0).usuario,
          correo_usuario: res.rows.item(0).correo_usuario,
          direccion: res.rows.item(0).direccion,
          foto_perfil: res.rows.item(0).foto_perfil
        };
        this.usuarioUnico.next(usuario as any); // Emitir los cambios
        return usuario; // Retorna el usuario correctamente
      } else {
        this.alerta.GenerarAlerta('ERROR', 'Usuario no encontrado');
        return null;
      }
    }).catch(e => {
      this.alerta.GenerarAlerta('ERROR', 'Problema buscando usuario: ' + JSON.stringify(e));
      return null;
    });
  }
  
  

  // PERFIL
  consultarPerfil(id_usuario: number) {
    return this.database.executeSql('SELECT * FROM tablaUsuario WHERE id_usuario = ?', [id_usuario]).then(res => {
      let perfil = null;
      if (res.rows.length > 0) {
        perfil = {
          id_usuario: res.rows.item(0).id_usuario,
          usuario: res.rows.item(0).usuario,
          clave_usuario: res.rows.item(0).clave_usuario,
          correo_usuario: res.rows.item(0).correo_usuario,
          direccion: res.rows.item(0).direccion,
          foto_perfil: res.rows.item(0).foto_perfil
        };
      }
      return perfil;
    }).catch(e => {
      this.alerta.GenerarAlerta('Error', 'Error al consultar el perfil: ' + JSON.stringify(e));
      return null;
    });
  }

  verificarPerfil(usuario: string, correo_usuario: string) {
    return this.database.executeSql('SELECT * FROM tablaUsuario WHERE usuario = ? OR correo_usuario = ?', [usuario, correo_usuario]).then(res => {
      return res.rows.length > 0;  // Devuelve true si el perfil ya existe
    }).catch(e => {
      this.alerta.GenerarAlerta('Error', 'Error al verificar el perfil: ' + JSON.stringify(e));
      return false;
    });
  }

  
  modificarPerfil(id_usuario: number, usuario: string, clave_usuario: string, correo_usuario: string, direccion: string, foto_perfil: string | null) {
  return this.database.executeSql(
    'UPDATE tablaUsuario SET usuario = ?, clave_usuario = ?, correo_usuario = ?, direccion = ?, foto_perfil = ? WHERE id_usuario = ?',
    [usuario, clave_usuario, correo_usuario, direccion, foto_perfil, id_usuario]
  ).then(res => {
    console.log('Perfil actualizado');
    return res.rowsAffected > 0;
  }).catch(e => {
    console.error('Error al modificar el perfil: ', e);
  });
}


  
  eliminarPerfil(id_usuario: number) {
    return this.database.executeSql(
      'DELETE FROM tablaUsuario WHERE id_usuario = ?',
      [id_usuario]
    ).then(res => {
      return res.rowsAffected > 0;  // Devuelve true si la eliminación fue exitosa
    }).catch(e => {
      this.alerta.GenerarAlerta('Error', 'Error al eliminar el perfil: ' + JSON.stringify(e));
      return false;
    });
  }


  async actualizarFotoPerfil(id_usuario: number, foto: string) {
    try {
      const res = await this.database.executeSql(
        'UPDATE tablaUsuario SET foto_perfil = ? WHERE id_usuario = ?',
        [foto, id_usuario]
      );
      console.log('Foto de perfil actualizada correctamente');
      return res.rowsAffected > 0; // Devuelve true si la actualización fue exitosa
    } catch (e) {
      this.alerta.GenerarAlerta('Error', 'Error al actualizar la foto de perfil: ' + JSON.stringify(e));
      return false;
    }
  }
  
  async obtenerFotoPerfil(id_usuario: number): Promise<string | null> {
    try {
      const res = await this.database.executeSql(
        'SELECT foto_perfil FROM tablaUsuario WHERE id_usuario = ?',
        [id_usuario]
      );
      if (res.rows.length > 0) {
        return res.rows.item(0).foto_perfil;
      }
      return null;
    } catch (e) {
      console.error('Error al obtener la foto de perfil:', e);
      return null;
    }
  }
  



  //CARRITO
  agregarCarrito(id_album: number, id_usuario: number, cantidad: number): Promise<void> {
    return this.database.executeSql(
      'INSERT INTO tablaCarrito (cantidad, id_album, id_usuario) VALUES (?, ?, ?)',
      [cantidad, id_album, id_usuario]
    ).then(() => {
      console.log('Producto agregado al carrito');
    }).catch(e => {
      this.alerta.GenerarAlerta('Error', 'Error al agregar al carrito: ' + JSON.stringify(e));
    });
  }
  
  

  mostrarCarrito(idusuario: number): Promise<Carrito[]> {
    return this.database.executeSql(
      `SELECT c.id_carrito, c.id_usuario, c.cantidad, p.id_album, 
              p.nombre_artista, p.nombre_album, p.precio_album, p.portada_album 
       FROM tablaCarrito c 
       JOIN tablaProducto p ON c.id_album = p.id_album 
       WHERE c.id_usuario = ?`,
      [idusuario]
    ).then(res => {
      let items: Carrito[] = [];
      if (res.rows.length > 0) {
        for (let i = 0; i < res.rows.length; i++) {
          items.push({
            id_carrito: res.rows.item(i).id_carrito,
            id_usuario: res.rows.item(i).id_usuario,
            cantidad: res.rows.item(i).cantidad,
            id_album: res.rows.item(i).id_album,
            nombre_artista: res.rows.item(i).nombre_artista,
            nombre_album: res.rows.item(i).nombre_album,
            precio_album: res.rows.item(i).precio_album,
            portada_album: res.rows.item(i).portada_album,
          });
        }
      }
      this.listadoCarrito.next(items as any); // Emitir la lista actualizada
      return items;
    }).catch(e => {
      console.error('Error al mostrar carrito: ', e);
      return [];
    });
  }
  
  
  
  

  actualizarCantidad(cantidad: number, id_carrito: number): Promise<void> {
    return this.database.executeSql(
      'UPDATE tablaCarrito SET cantidad = ? WHERE id_carrito = ?',
      [cantidad, id_carrito]
    ).then(() => {
      console.log('Cantidad actualizada en el carrito');
    }).catch(e => {
      console.error('Error al actualizar la cantidad: ', e);
    });
  }
  
  

  eliminarCarrito(id_carrito:number){
    return this.database.executeSql('DELETE FROM tablaCarrito WHERE id_carrito = ?',[id_carrito]).then(()=>{
      console.log('funciona eliminacion carrito');
    }).catch(e=>{
      this.alerta.GenerarAlerta('Error','Error con eliminacion de carrito'+JSON.stringify(e))
    })
  }

  vaciarCarrito(id_usuario: number) {
    console.log('Intentando vaciar el carrito para el usuario:', id_usuario);
    return this.database.executeSql(
      'DELETE FROM tablaCarrito WHERE id_usuario = ?', 
      [id_usuario]
    ).then(() => {
      console.log('Carrito vaciado correctamente para el usuario:', id_usuario);
      this.listadoCarrito.next([]); // Limpia el observable para que la vista se actualice
    }).catch(e => {
      console.error('Error al vaciar el carrito:', e);
    });
  }
  
  
  


  //FAVORITOS
  consultarFavoritos(id_usuario: number) {
    return this.database.executeSql(
      `SELECT f.id_favorito, p.id_album, p.nombre_artista, p.nombre_album, 
       p.detalle_album, p.precio_album, p.portada_album 
       FROM tablaFavorito f 
       JOIN tablaProducto p ON f.id_album = p.id_album 
       WHERE f.id_usuario = ?`,
      [id_usuario]
    ).then(res => {
      let favoritos: Favoritos[] = [];
      for (let i = 0; i < res.rows.length; i++) {
        favoritos.push({
          id_favorito: res.rows.item(i).id_favorito,
          id_album: res.rows.item(i).id_album,
          nombre_artista: res.rows.item(i).nombre_artista,
          nombre_album: res.rows.item(i).nombre_album,
          detalle_album: res.rows.item(i).detalle_album,
          precio_album: res.rows.item(i).precio_album,
          portada_album: res.rows.item(i).portada_album
        });
      }
      this.listadoFavorito.next(favoritos as any); // Emitir la lista actualizada
    }).catch(e => {
      console.error('Error al consultar favoritos:', e);
    });
  }
  

  
  agregarFavorito(id_album: number, id_usuario: number) {
    return this.database.executeSql(
      'INSERT INTO tablaFavorito (id_usuario, id_album) VALUES (?, ?)',
      [id_usuario, id_album]
    ).then(() => {
      console.log('Álbum añadido a favoritos');
      return true;
    }).catch(e => {
      this.alerta.GenerarAlerta('Error', 'Error al añadir a favoritos: ' + JSON.stringify(e));
      return false;
    });
  }
  
  eliminarFavorito(id_album: number, id_usuario: number) {
    return this.database.executeSql(
      'DELETE FROM tablaFavorito WHERE id_usuario = ? AND id_album = ?',
      [id_usuario, id_album]
    ).then(() => {
      console.log('Álbum eliminado de favoritos');
      return true;
    }).catch(e => {
      this.alerta.GenerarAlerta('Error', 'Error al eliminar de favoritos: ' + JSON.stringify(e));
      return false;
    });
  }

  eliminarFavoritodeFavoritos(id_favorito:number){
    return this.database.executeSql('DELETE FROM tablaFavorito WHERE id_favorito = ?',[id_favorito]).then(()=>{
      console.log('Funciona la borracion del favorito');
    }).catch(e => {
      this.alerta.GenerarAlerta('Error', 'Error al eliminar de favoritos de favoritos: ' + JSON.stringify(e));
    });
  }
  
  verificarFavorito(id_album: number, id_usuario: number) {
    return this.database.executeSql(
      'SELECT * FROM tablaFavorito WHERE id_usuario = ? AND id_album = ?',
      [id_usuario, id_album]
    ).then(res => {
      return res.rows.length > 0;
    }).catch(e => {
      console.error('Error al verificar favorito:', e);
      return false;
    });
  }
  


  //RECUPERAR CONTRASEÑA
  verificarCorreo(correo: string): Promise<boolean> {
    return this.database.executeSql(
      'SELECT * FROM tablaUsuario WHERE correo_usuario = ?', [correo]
    ).then(res => {
      return res.rows.length > 0;
    }).catch(e => {
      console.error('Error verificando correo:', e);
      return false;
    });
  }
  
  actualizarContrasenaPorCorreo(correo: string, nuevaContrasena: string): Promise<boolean> {
    return this.database.executeSql(
      'UPDATE tablaUsuario SET clave_usuario = ? WHERE correo_usuario = ?',
      [nuevaContrasena, correo]
    ).then(() => {
      console.log('Contraseña actualizada');
      return true;
    }).catch(e => {
      console.error('Error actualizando contraseña:', e);
      return false;
    });
  }
  

  //VENTA
  // Método para registrar ventas con actualización del stock
  async registrarVenta(id_usuario: number, total_venta: number, carrito: Carrito[]): Promise<void> {
    try {
      const resVenta = await this.database.executeSql(
        'INSERT INTO tablaVenta (total_venta, id_usuario) VALUES (?, ?)',
        [total_venta, id_usuario]
      );
      const id_venta = resVenta.insertId;

      for (const album of carrito) {
        await this.database.executeSql(
          'INSERT INTO tablaArticuloVenta (id_venta, id_album, cantidad) VALUES (?, ?, ?)',
          [id_venta, album.id_album, album.cantidad]
        );

        // Actualizar el stock del producto
        await this.database.executeSql(
          'UPDATE tablaProducto SET stock = stock - ? WHERE id_album = ?',
          [album.cantidad, album.id_album]
        );
      }

      // Emitir el evento de cambio de stock
      this.emitirCambioStock();

      console.log('Venta registrada y stock actualizado correctamente.');
    } catch (e) {
      console.error('Error al registrar la venta:', e);
      throw e;
    }
  }
  
  

}

//VACIA EL CARRITO Y FUNCIONA LA BOLETA NO CTRL Z
//SI TE ARREPIENTES BORA HASTA ACA
//ULTIMA VEZ INTENTANDO HACER EL STOCK