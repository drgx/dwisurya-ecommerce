<?php
class ControllerExtensionModuleIshiServicesBlock extends Controller {
	private $error = array();

	public function index() {
		$this->load->language('extension/module/ishiservicesblock');

		$this->document->setTitle($this->language->get('heading_title1'));

		$this->load->model('setting/module');

		if (($this->request->server['REQUEST_METHOD'] == 'POST') && $this->validate()) {
			if (!isset($this->request->get['module_id'])) {
				$this->model_setting_module->addModule('ishiservicesblock', $this->request->post);
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
				'href' => $this->url->link('extension/module/ishiservicesblock', 'user_token=' . $this->session->data['user_token'], true)
			);
		} else {
			$data['breadcrumbs'][] = array(
				'text' => $this->language->get('heading_title1'),
				'href' => $this->url->link('extension/module/ishiservicesblock', 'user_token=' . $this->session->data['user_token'] . '&module_id=' . $this->request->get['module_id'], true)
			);
		}

		if (!isset($this->request->get['module_id'])) {
			$data['action'] = $this->url->link('extension/module/ishiservicesblock', 'user_token=' . $this->session->data['user_token'], true);
		} else {
			$data['action'] = $this->url->link('extension/module/ishiservicesblock', 'user_token=' . $this->session->data['user_token'] . '&module_id=' . $this->request->get['module_id'], true);
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
			$data['title'] = array();
		}
		
		if (isset($this->request->post['subtitle'])) {
			$data['subtitle'] = $this->request->post['subtitle'];
		} elseif (!empty($module_info)) {
			$data['subtitle'] = $module_info['subtitle'];
		} else {
			$data['subtitle'] = '';
		}
		
		if (isset($this->request->post['bannerposition'])) {
			$data['bannerposition'] = $this->request->post['bannerposition'];
		} elseif (!empty($module_info)) {
			$data['bannerposition'] = $module_info['bannerposition'];
		} else {
			$data['bannerposition'] = '';
		}
		
		if (isset($this->request->post['width'])) {
			$data['width'] = $this->request->post['width'];
		} elseif (!empty($module_info)) {
			$data['width'] = $module_info['width'];
		} else {
			$data['width'] = '50';
		}
		
		if (isset($this->request->post['height'])) {
			$data['height'] = $this->request->post['height'];
		} elseif (!empty($module_info)) {
			$data['height'] = $module_info['height'];
		} else {
			$data['height'] = '50';
		}
		
		$this->load->model('tool/image');
		
		if (isset($this->request->post['service'])) {
			$services = $this->request->post['service'];
		} elseif (isset($this->request->get['module_id'])) {
			$services = $module_info['service'];
		} else {
			$services = array();
		}

		if (isset($this->request->post['image'])) {
			$data['image'] = $this->request->post['image'];
		} elseif (!empty($module_info)) {
			
			$data['image'] = $module_info['image'];
		} else {
			$data['image'] = 'no_image.png';
		}

		if (isset($this->request->post['image']) && is_file(DIR_IMAGE . $this->request->post['image'])) {
			$data['thumb'] = $this->model_tool_image->resize($this->request->post['image'], 100, 100);
		} elseif (!empty($module_info) && is_file(DIR_IMAGE . $module_info['image'])) {
			$data['thumb'] = $this->model_tool_image->resize($module_info['image'], 100, 100);
		} else {
			$data['thumb'] = $this->model_tool_image->resize('no_image.png', 100, 100);
		}
		
		$placeholder = $this->model_tool_image->resize('no_image.png', 100, 100);

		

		if (isset($this->request->post['servicebg'])) {
			$data['servicebg'] = $this->request->post['servicebg'];
		} elseif (!empty($module_info)) {
			
			$data['servicebg'] = $module_info['servicebg'];
		} else {
			$data['servicebg'] = 'no_image.png';
		}

		if (isset($this->request->post['servicebg']) && is_file(DIR_IMAGE . $this->request->post['servicebg '])) {
			$data['servicebgthumb'] = $this->model_tool_image->resize($this->request->post['servicebg'], 100, 100);
		} elseif (!empty($module_info) && is_file(DIR_IMAGE . $module_info['servicebg'])) {
			$data['servicebgthumb'] = $this->model_tool_image->resize($module_info['servicebg'], 100, 100);
		} else {
			$data['servicebgthumb'] = $this->model_tool_image->resize('no_image.png', 100, 100);
		}



		$data['services'] = array();

		foreach ($services as $key => $value) {
			foreach ($value as $service) {
				if (is_file(DIR_IMAGE . $service['image'])) {
					$image = $service['image'];
					$thumb = $service['image'];
				} else {
					$image = '';
					$thumb = 'no_image.png';
				}
				
				$data['services'][$key][] = array(
					'title'      => $service['title'],
					'description'=> $service['description'],
					'image'      => $image,
					'thumb'      => $this->model_tool_image->resize($thumb, 100, 100)
				);
			}
		}
		
		$data['placeholder'] = $this->model_tool_image->resize('no_image.png', 100, 100);

		$this->load->model('localisation/language');

		$data['languages'] = $this->model_localisation_language->getLanguages();
		

		if (isset($this->request->post['status'])) {
			$data['status'] = $this->request->post['status'];
		} elseif (!empty($module_info)) {
			$data['status'] = $module_info['status'];
		} else {
			$data['status'] = '';
		}

		$data['header'] = $this->load->controller('common/header');
		$data['column_left'] = $this->load->controller('common/column_left');
		$data['footer'] = $this->load->controller('common/footer');

		$this->response->setOutput($this->load->view('extension/module/ishiservicesblock', $data));
	}

	protected function validate() {
		if (!$this->user->hasPermission('modify', 'extension/module/ishiservicesblock')) {
			$this->error['warning'] = $this->language->get('error_permission');
		}

		if ((utf8_strlen($this->request->post['name']) < 3) || (utf8_strlen($this->request->post['name']) > 64)) {
			$this->error['name'] = $this->language->get('error_name');
		}

		return !$this->error;
	}
}