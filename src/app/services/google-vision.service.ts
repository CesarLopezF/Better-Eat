import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class GoogleVisionService {

  constructor(public http: Http) { }

  getSimilarProducts(base64Image){
    const body = {
      "requests": [
        {
          "image": {
            "content": base64Image
          },
          "features": [
            {
              "type": "PRODUCT_SEARCH",
              "maxResults": 4
            }
          ],
          "imageContext": {
            "productSearchParams": {
              "productSet": "projects/better-eat/locations/us-west1/productSets/better-eat-products",
              "productCategories": [
                   "packagedgoods-v1"
              ],
              "filter": ""
            }
          }
        }
      ]
    }

    return this.http.post('https://vision.googleapis.com/v1/images:annotate?key=' + environment.googleCloudVisionAPIKey, body);
  }
}
