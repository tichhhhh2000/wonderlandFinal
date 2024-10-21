import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ServicebdService } from 'src/app/services/servicebd.service';

@Component({
  selector: 'app-ver-album',
  templateUrl: './ver-album.page.html',
  styleUrls: ['./ver-album.page.scss'],
})
export class VerAlbumPage implements OnInit {

  albums: any [] = [];

  constructor(private router: Router, private bd: ServicebdService) { }

  ngOnInit() {
    this.bd.consultarProducto()
    this.bd.dbState().subscribe(res=>{
      if(res) {
        this.bd.fetchProducto().subscribe(data=>{
          this.albums = data
        })
      }
    })
  }

}

//NO MAS COTROL Z