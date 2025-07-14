import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { ProductsComponent } from './components/products/products.component';


@NgModule({
  declarations: [
    ProductsComponent ],
  imports: [
    BrowserModule,
    HttpClientModule,
  ],
  providers: [],
  bootstrap: []
})
export class AppModule {}
function NgModule(arg0: { declarations: (typeof ProductsComponent)[]; imports: any[]; providers: never[]; bootstrap: any[]; }): (target: typeof AppModule) => void | typeof AppModule {
    throw new Error('Function not implemented.');
}

