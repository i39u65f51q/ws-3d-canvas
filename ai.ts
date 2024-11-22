import OpenAI from "openai";
import FormData from "form-data";
import axios, { AxiosResponse } from "axios";

export class AI{    
    private readonly openai:OpenAI;
    private readonly ak:string;
    constructor(){                
        this.ak = "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"
        this.openai = new OpenAI({apiKey:this.ak})
        
    }

    public async generateByPrompt (prompt:string){ 
      const image = await this.openai.images.generate({model: "dall-e-2", prompt:prompt})
      return image.data
    }

    public async generateByImg(imgUrl:string):Promise <{created:number, data:{url:string}[]}>{
        const imgBuffer = imgUrl.split(',')[1];
        const imageBuffer = Buffer.from(imgBuffer, "base64");            
        const formData = new FormData();
        
        formData.append("model", "dall-e-2");
        formData.append("image", imageBuffer, {
          filename: "image.png",
          contentType: "image/png",
        });
        formData.append("n", "1");
        formData.append("size", "1024x1024");
    
        // Make the API request
        const response:AxiosResponse = await axios.post(
          "https://api.openai.com/v1/images/variations",
          formData,
          {
            headers: {
              ...formData.getHeaders(),
              Authorization: `Bearer ${this.ak}`
            },
          }
        );
        
        return response.data
    } 
}