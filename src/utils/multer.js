import multer from 'multer'
export const fileValidation = {
    image: ['image/jpeg', 'image/png', 'image/gif'],
    file: ['application/pdf', 'application/msword'],
    video: ['video/mp4','video/quicktime','video/mpeg']
}
export function fileupload(customValidation=[])//3l4an y3ml folder bl 2sm 2ly hytb3tlo lw mkan4 hy5azo fy 7aga asmha general
{   
    const storage=multer.diskStorage({})

    function fileFilter(req,file,cb) //check if the type of the file we sent isnt a hack or something
    {
        if(customValidation.includes(file.mimetype)){
            cb(null,true)
        }else{
            cb(new Error("INVALID_FORMAT"),false)
        }

    }
    const upload=multer({fileFilter,storage})
    return upload
} 