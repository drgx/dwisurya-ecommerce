<?php
class ControllerExtensionModuleIshiServicesBlock extends Controller {
	public function index($setting) {
		
		$this->load->model('tool/image');
		$language_id = $this->config->get('config_language_id');
		
		if(isset($setting['title'][$language_id])){
			$data['title'] = $setting['title'][$language_id];
		}

		if(isset($setting['subtitle'][$language_id])){
			$data['subtitle'] = $setting['subtitle'][$language_id];
		}

		if(isset($setting['bannerposition'])){
			$data['bannerposition'] = $setting['bannerposition'];
		}

		$ishiservices = array();

		if(!empty($setting['image'])) {
			if ($this->request->server['HTTPS']) {
				$data['bgimage'] = $this->config->get('config_ssl') . 'image/' . $setting['image'];
			} else {
				$data['bgimage'] = $this->config->get('config_url') . 'image/' . $setting['image'];
			}
		}
		

		if(!empty($setting['servicebg'])) {
			if ($this->request->server['HTTPS']) {
				$data['servicebg'] = $this->config->get('config_ssl') . 'image/' . $setting['servicebg'];
			} else {
				$data['servicebg'] = $this->config->get('config_url') . 'image/' . $setting['servicebg'];
			}
		}

		
		if(isset($setting['service'][$language_id])){
			$ishiservices = $setting['service'][$language_id];
		}

		foreach ($ishiservices as $ishiservice) {
			if(isset($ishiservice['image'])){
			$serviceiimage = $this->model_tool_image->resize($ishiservice['image'], $setting['width'], $setting['height']);
			}else{
				$serviceiimage = '';
			}
			$data['ishiservices'][] = array(
				'image' => $serviceiimage,
				'title' => $ishiservice['title'],
				'description'  => $ishiservice['description']
			);
		}

		$servicesCount = count($ishiservices);
		$leftServicesCount = ceil($servicesCount/2);
		$rightServicesCount = $servicesCount - $leftServicesCount;

		if(!empty($ishiservices)){
			$counter = 1;
			foreach ($ishiservices as $ishiservice) {
				if($counter <= $leftServicesCount) {
					if(isset($ishiservice['image'])){
					$serviceiimage = $this->model_tool_image->resize($ishiservice['image'], $setting['width'], $setting['height']);
					}else{
						$serviceiimage = '';
					}
					$data['leftservices'][] = array(
						'image' => $serviceiimage,
						'title' => $ishiservice['title'],
						'description'  => $ishiservice['description']
					);
				}else{
					if(isset($ishiservice['image'])){
					$serviceiimage = $this->model_tool_image->resize($ishiservice['image'], $setting['width'], $setting['height']);
					}else{
						$serviceiimage = '';
					}
					$data['rightservices'][] = array(
						'image' => $serviceiimage,
						'title' => $ishiservice['title'],
						'description'  => $ishiservice['description']
					);
				}
				$counter++;
			}
		}
		
		return $this->load->view('extension/module/ishiservicesblock', $data);
	}
}