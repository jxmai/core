/*
 * Copyright 2011 PrimeFaces Extensions.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 * $Id$
 */

package org.primefaces.extensions.component.masterdetail;

import org.primefaces.renderkit.CoreRenderer;

import javax.el.ValueExpression;
import javax.faces.component.UIComponent;
import javax.faces.context.FacesContext;
import java.io.IOException;
import java.util.HashMap;
import java.util.Map;

/**
 * Renderer for the {@link MasterDetail} component.
 *
 * @author  Oleg Varaksin / last modified by $Author$
 * @version $Revision$
 */
public class MasterDetailRenderer extends CoreRenderer {

	@Override
	public void encodeEnd(final FacesContext fc, UIComponent component) throws IOException {
		MasterDetail masterDetail = (MasterDetail) component;

		if (masterDetail.isSelectDetailRequest(fc)) {
			// component has been navigated via SelectDetailLevel
			MasterDetailLevel mdl = masterDetail.getDetailLevelToProcess(fc);

            // resolve all possible context values for this master detail level
            evaluateContextValues(fc, mdl);

            // TODO
		} else {
			// component has been navigated from outside, e.g. GET request or POST update from another component
            MasterDetailLevel mdl = masterDetail.getDetailLevelByLevel(masterDetail.getLevel());

            // resolve all possible context values for this master detail level
            evaluateContextValues(fc, mdl);

			// TODO
		}
	}

	protected void evaluateContextValues(final FacesContext fc, final MasterDetailLevel mdl) {
		@SuppressWarnings("unchecked")
		Map<String, ValueExpression> contextValueVEs = (Map<String, ValueExpression>) mdl.getAttributes().get("contextValueVEs");
		if (contextValueVEs == null || contextValueVEs.isEmpty()) {
			return;
		}

		Map<String, Object> contextValues = new HashMap<String, Object>();
		for (Map.Entry<String, ValueExpression> entry : contextValueVEs.entrySet()) {
			contextValues.put(entry.getKey(), entry.getValue().getValue(fc.getELContext()));
		}

		mdl.getAttributes().put("contextValues", contextValues);
	}

	@Override
	public void encodeChildren(final FacesContext fc, UIComponent component) throws IOException {
		// rendering happens on encodeEnd
	}

	@Override
	public boolean getRendersChildren() {
		return true;
	}
}
