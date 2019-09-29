import React,{ useState } from "react";
import { renderTooltipText } from "../Common";
import {PRE_FILE} from "@/api/path";

// 预览图片
// {"name":"1569394871004_6239936_092702973000_2.jpg",
// "size":234511,
// "fid":"6,
// 0687f89fdbb9",
// "url":"http://192.168.20.124:9080/6,0687f89fdbb9"}
function ImgPreview(props){
	const {jsonStr} = props
	const [active, setActive] = useState(false);
	if (jsonStr==null) return ''

	try {
		const imgJson = JSON.parse(jsonStr);
		const {name="img.img",fid} = imgJson

        const fileType = (name.substring(name.lastIndexOf(".")+1));

		const realRul =PRE_FILE + fileType + "/"+ fid

		// 如果是excel文件则显示下载链接
		// 否则就认为是图片就显示图片
		if (name.indexOf('.xls')>-1){
			return <div className={`img-preview ${active?'enactive':''}`} >
			<a target={"_blank"} className="blue" href={realRul}>{renderTooltipText(name,10)}</a>
			</div>
		} else{
			return <div className={`img-preview ${active?'enactive':''}`} onClick={() => setActive(!active)}>
			<img className="img-preview-inner" src={realRul} alt={(''+name).slice(-10)} onClick={(e) => {
				e.preventDefault()
				setActive(!active)
			}} />
			</div>			
		}
		
	} catch (ex){
		return ""
	}

}
export default ImgPreview;