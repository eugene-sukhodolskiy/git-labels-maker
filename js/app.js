class App{
	constructor(){
		this.labelsJSONFileURL = "./labels.json"
		this.labels = [];
	}

	init(){
		const self = this;
		$('.generate-code').on('click', function(){
			self.generateCode();
		});

		$('.all-labels').on('click', function(){
			$('.label').click();
		});

		this.loadLabels();
	}

	loadLabels(){
		const self = this;
		$.getJSON(this.labelsJSONFileURL, function(labels){
			self.labels = labels;
			self.renderLabels();
		});
	}

	renderLabels(){
		let html = '<ul class="list">';
		for(let label of this.labels){
			let labelJSON = JSON.stringify({
				label: label.label,
				color: label.color,
				description: label.description
			});

			let inverse = (typeof label.inverse != 'undefined' && label.inverse) ? 'color: #fff;' : '';
			html += `<li data-json='${labelJSON}' data-selected="false" class="label">
				<ion-icon name="checkmark-outline"></ion-icon>
				<span class="label-name" style="background-color: ${label.color}; ${inverse}">${label.label}</span> ${label.description}
			</li>`;
		}

		html += '</ul>';

		$('.labels').html(html);
		this.initLabelList();

		$('.generate-code').show();
	}

	initLabelList(){
		$('[data-selected]').on('click', function(){
			let currentState = $(this).attr("data-selected");
			let state = currentState == 'true' ? 'false' : 'true';
			$(this).attr("data-selected", state);
			if(state == 'true'){
				$(this).addClass('selected')
			}else{
				$(this).removeClass('selected')
			}
		});
	}

	generateCode(){
		let labels = $('[data-selected="true"]');
		if(!labels.length){
			return false;
		}

		let labelsArray = [];
		for(let label of labels){
			labelsArray.push(JSON.parse($(label).attr('data-json')));
		}
		let labelsArrayJSON = JSON.stringify(labelsArray);

		let code = `let labels = JSON.parse('${labelsArrayJSON}');
let form = document.querySelector('#new_label');
let data = new FormData(form);
for(let label of labels){
	data.set('label[name]', label.label);
	data.set('label[description]', label.description);
	data.set('label[color]', label.color);
	let response = await fetch(form.action, {
	  method: 'POST',
	  body: data
	});
}

document.location.reload();`;

		$('#result').val(code);
	}
}

const app = new App();

$(document).ready(function(){
	app.init();
});