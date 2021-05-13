import { DataServiceService } from './../services/data-service.service';
import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class DataResolverService implements Resolve<any> {

  constructor(private dataService:DataServiceService) { }

  resolve(route:ActivatedRouteSnapshot)
  {
    let id=route.paramMap.get('id');
    return this.dataService.getData(id);
  }
}
