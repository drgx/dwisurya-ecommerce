<?php
class ControllerCommonMenu extends Controller {
	public function index() {
		$this->load->language('common/menu');

		// Menu
		$this->load->model('catalog/category');

		$this->load->model('catalog/product');
		$this->load->model('catalog/manufacturer');


		$data['categories'] = array();
		$data['manufactures'] = array();


		$data['home'] = $this->url->link('common/home');

		if(!isset($this->request->get['route']) || ($this->request->get['route'] == 'common/home')) {
			$data['ishome'] = 'home';
		} else {
			$data['ishome'] = 'open';
		}

		$categories = $this->model_catalog_category->getCategories(0);
		$manufactures = $this->model_catalog_manufacturer->getManufacturers();

		foreach ($categories as $category) {
			if ($category['top']) {
				// Level 2
				$children_data = array();

				$children = $this->model_catalog_category->getCategories($category['category_id']);

				foreach ($children as $child) {
					$filter_data = array(
						'filter_category_id'  => $child['category_id'],
						'filter_sub_category' => true
					);

					/* 2 Level Sub Categories START */
					$childs_data = array();
					$child_2 = $this->model_catalog_category->getCategories($child['category_id']);

					foreach ($child_2 as $childs) {
						$filter_data = array(
							'filter_category_id'  => $childs['category_id'],
							'filter_sub_category' => true
						);


						if(!empty($childs['image'])) {
							$image_category = $this->model_tool_image->resize($childs['image'], 200, 200);
						}else{
							$image_category = $this->config->get('config_url') . 'image/no_image.png';
						}
						$childs_data[] = array(
							'name'  => $childs['name'],
							'href'  => $this->url->link('product/category', 'path=' . $category['category_id'] . '_' . $child['category_id'] . '_' . $childs['category_id']),
							'image' => $image_category
						);
					}
					/* 2 Level Sub Categories END */


					$children_data[] = array(
						'name'  => $child['name'],
						'href'  => $this->url->link('product/category', 'path=' . $category['category_id'] . '_' . $child['category_id']),
						'column'   => $child['column'] ? $child['column'] : 1,
						'childs' => $childs_data,
					);
				}



				// Level 1
				$data['categories'][] = array(
					'name'     => $category['name'],
					'children' => $children_data,
					'column'   => $category['column'] ? $category['column'] : 1,
					'href'     => $this->url->link('product/category', 'path=' . $category['category_id']),
				);
			}
		}

		// $manufacturer = $this->model_catalog_manufacturer->getManufacturer(0);
		foreach ($manufactures as $manufacture) {
			$data['manufactures'][] = array(
				'name'     => $manufacture['name'],
				'href'     => $this->url->link('product/manufacturer/info', 'manufacturer_id=' . $manufacture['manufacturer_id'])
			);
		}

		// var_dump($data);exit;
		return $this->load->view('common/menu', $data);
	}
}
