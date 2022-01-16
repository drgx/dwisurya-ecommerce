<?php
class ControllerExtensionModuleIshiGalleryBlock extends Controller {
	private $error = array();

	public function index() {
		$this->load->language('extension/module/ishigalleryblock');

		$this->document->setTitle($this->language->get('heading_title1'));

		$this->load->model('setting/module');

		$this->load->model('localisation/language');

		$data['languages'] = $this->model_localisation_language->getLanguages();

		if (($this->request->server['REQUEST_METHOD'] == 'POST') && $this->validate()) {
			if (!isset($this->request->get['module_id'])) {
				$this->model_setting_module->addModule('ishigalleryblock', $this->request->post);
			} else {
				$this->model_setting_module->editModule($this->request->get['module_id'], $this->request->post);
			}

			$this->session->data['success'] = $this->language->get('text_success');

			$this->response->redirect($this->url->link('marketplace/extension', 'user_token=' . $this->session->data['user_token'] . '&type=module', true));
		}

		if (isset($this->error['warning'])) {
			$data['error_warning'] = $this->error['warning'];
		} else {
			$data['error_warning'] = '';
		}

		if (isset($this->error['name'])) {
			$data['error_name'] = $this->error['name'];
		} else {
			$data['error_name'] = '';
		}

		if (isset($this->error['title'])) {
			$data['error_title'] = $this->error['title'];
		} else {
			$data['error_title'] = array();
		}

		if (isset($this->error['subtitle'])) {
			$data['error_subtitle'] = $this->error['subtitle'];
		} else {
			$data['error_subtitle'] = array();
		}

		if (isset($this->error['width'])) {
			$data['error_width'] = $this->error['width'];
		} else {
			$data['error_width'] = '';
		}

		if (isset($this->error['height'])) {
			$data['error_height'] = $this->error['height'];
		} else {
			$data['error_height'] = '';
		}

		$data['breadcrumbs'] = array();

		$data['breadcrumbs'][] = array(
			'text' => $this->language->get('text_home'),
			'href' => $this->url->link('common/dashboard', 'user_token=' . $this->session->data['user_token'], true)
		);

		$data['breadcrumbs'][] = array(
			'text' => $this->language->get('text_extension'),
			'href' => $this->url->link('marketplace/extension', 'user_token=' . $this->session->data['user_token'] . '&type=module', true)
		);

		if (!isset($this->request->get['module_id'])) {
			$data['breadcrumbs'][] = array(
				'text' => $this->language->get('heading_title1'),
				'href' => $this->url->link('extension/module/ishigalleryblock', 'user_token=' . $this->session->data['user_token'], true)
			);
		} else {
			$data['breadcrumbs'][] = array(
				'text' => $this->language->get('heading_title1'),
				'href' => $this->url->link('extension/module/ishigalleryblock', 'user_token=' . $this->session->data['user_token'] . '&module_id=' . $this->request->get['module_id'], true)
			);
		}

		if (!isset($this->request->get['module_id'])) {
			$data['action'] = $this->url->link('extension/module/ishigalleryblock', 'user_token=' . $this->session->data['user_token'], true);
		} else {
			$data['action'] = $this->url->link('extension/module/ishigalleryblock', 'user_token=' . $this->session->data['user_token'] . '&module_id=' . $this->request->get['module_id'], true);
		}

		
		$data['cancel'] = $this->url->link('marketplace/extension', 'user_token=' . $this->session->data['user_token'] . '&type=module', true);

		if (isset($this->request->get['module_id']) && ($this->request->server['REQUEST_METHOD'] != 'POST')) {
			$module_info = $this->model_setting_module->getModule($this->request->get['module_id']);
		}

		if (isset($this->request->post['name'])) {
			$data['name'] = $this->request->post['name'];
		} elseif (!empty($module_info)) {
			$data['name'] = $module_info['name'];
		} else {
			$data['name'] = '';
		}

		if (isset($this->request->post['title'])) {
			$data['title'] = $this->request->post['title'];
		} elseif (!empty($module_info)) {
			$data['title'] = $module_info['title'];
		} else {
			$data['title'] = '';
		}

		if (isset($this->request->post['subtitle'])) {
			$data['subtitle'] = $this->request->post['subtitle'];
		} elseif (!empty($module_info)) {
			$data['subtitle'] = $module_info['subtitle'];
		} else {
			$data['subtitle'] = '';
		}

		if (isset($this->request->post['width'])) {
			$data['width'] = $this->request->post['width'];
		} elseif (!empty($module_info)) {
			$data['width'] = $module_info['width'];
		} else {
			$data['width'] = '130';
		}

		if (isset($this->request->post['height'])) {
			$data['height'] = $this->request->post['height'];
		} elseif (!empty($module_info)) {
			$data['height'] = $module_info['height'];
		} else {
			$data['height'] = '130';
		}

		if (isset($this->request->post['status'])) {
			$data['status'] = $this->request->post['status'];
		} elseif (!empty($module_info)) {
			$data['status'] = $module_info['status'];
		} else {
			$data['status'] = '';
		}
		
		if (isset($this->request->post['autoplay'])) {
			$data['autoplay'] = $this->request->post['autoplay'];
		} elseif (!empty($module_info) && isset($module_info['autoplay'])) {
			$data['autoplay'] = $module_info['autoplay'];
		} else {
			$data['autoplay'] = 0;
		}
		
		if (isset($this->request->post['loop'])) {
			$data['loop'] = $this->request->post['loop'];
		} elseif (!empty($module_info) && isset($module_info['loop'])) {
			$data['loop'] = $module_info['loop'];
		} else {
			$data['loop'] = 0;
		}
		
		$this->load->model('localisation/language');

		$data['languages'] = $this->model_localisation_language->getLanguages();
		
		$this->load->model('tool/image');

		if (isset($this->request->post['ishi_image'])) {
			$ishi_images = $this->request->post['ishi_image'];
		} elseif (!empty($module_info) && isset($module_info['ishi_image'])) {
			$ishi_images = $module_info['ishi_image'];
		} else {
			$ishi_images = array();
		}		

		$data['ishi_images'] = array();

		foreach ($ishi_images as $key => $value) {
			foreach ($value as $ishi_image) {
				if (is_file(DIR_IMAGE . $ishi_image['image'])) {
					$image = $ishi_image['image'];
					$thumb = $ishi_image['image'];
				} else {
					$image = '';
					$thumb = 'no_image.png';
				}
				
				$data['ishi_images'][$key][] = array(
					'title'      => $ishi_image['title'],
					'image'      => $image,
					'thumb'      => $this->model_tool_image->resize($thumb, 100, 100),
					'sort_order' => $ishi_image['sort_order']
				);
			}
		}
		//echo'<pre>';print_r($data['ishi_images']);

		$data['placeholder'] = $this->model_tool_image->resize('no_image.png', 100, 100);

		$data['header'] = $this->load->controller('common/header');
		$data['column_left'] = $this->load->controller('common/column_left');
		$data['footer'] = $this->load->controller('common/footer');

		$this->response->setOutput($this->load->view('extension/module/ishigalleryblock', $data));
	}

	protected function validate() {
		if (!$this->user->hasPermission('modify', 'extension/module/ishigalleryblock')) {
			$this->error['warning'] = $this->language->get('error_permission');
		}

		if ((utf8_strlen($this->request->post['name']) < 3) || (utf8_strlen($this->request->post['name']) > 64)) {
			$this->error['name'] = $this->language->get('error_name');
		}

		if (!$this->request->post['width']) {
			$this->error['width'] = $this->language->get('error_width');
		}

		if (!$this->request->post['height']) {
			$this->error['height'] = $this->language->get('error_height');
		}

		foreach ($this->request->post['title'] as $language_id => $title) {
			if ((utf8_strlen($title) < 2) || (utf8_strlen($title) > 64)) {
				$this->error['title'][$language_id] = $this->language->get('error_title');
			}
		}

		// if (isset($this->request->post['banner_image'])) {
		// 	foreach ($this->request->post['banner_image'] as $language_id => $value) {
		// 		foreach ($value as $banner_image_id => $banner_image) {
		// 			if ((utf8_strlen($banner_image['title']) < 2) || (utf8_strlen($banner_image['title']) > 64)) {
		// 				$this->error['banner_image'][$language_id][$banner_image_id] = $this->language->get('error_imgtitle');
		// 			}
		// 		}
		// 	}
		// }

		return !$this->error;
	}
}
