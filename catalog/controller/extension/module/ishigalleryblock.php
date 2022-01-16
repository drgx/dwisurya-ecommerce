<?php
class ControllerExtensionModuleIshiGalleryBlock extends Controller {
	public function index($setting) {

		static $module = 0;		

		$this->load->model('design/banner');
		$this->load->model('tool/image');
		
		$language_id = $this->config->get('config_language_id');
		if(isset($setting['title'][$language_id])){
			$data['heading'] = $setting['title'][$language_id];
		}

		if(isset($setting['subtitle'][$language_id])){
			$data['subtitle'] = $setting['subtitle'][$language_id];
		}
		$data['ishi_sliderimages'] = array();
		$data['ishi_randomnumer'] = "ishigallery-" . rand();
		$data['autoplay'] = (isset($setting['autoplay']) && $setting['autoplay'])? 'true' : 'false';
		$data['loop'] = (isset($setting['loop']) && $setting['loop'])? 'true' : 'false';
		
		$imgs = $setting['ishi_image'];
		$results = array();
		if(isset($imgs[$language_id])){
			$results = $imgs[$language_id];
		}
			
			foreach ($results as $result) {
				if (is_file(DIR_IMAGE . $result['image'])) {
					$data['ishi_sliderimages'][] = array(
						'title'=> $result['title'],
						'sort_order'=> $result['sort_order'],
						'image' => $this->model_tool_image->resize($result['image'], $setting['width'], $setting['height'])
					);
				}
			}
		$data['module'] = $module++;
	
		return $this->load->view('extension/module/ishigalleryblock', $data);
	}
}