/*
 * Copyright 2011 - 2012 PrimeFaces Extensions.
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

package org.primefaces.extensions.component.requiredlabel;

import java.util.ArrayList;
import java.util.List;

import javax.el.ValueExpression;
import javax.faces.application.ResourceDependencies;
import javax.faces.application.ResourceDependency;
import javax.faces.component.html.HtmlOutputLabel;

import org.primefaces.extensions.component.base.Attachable;

/**
 * Component class for the <code>RequiredLabel</code> component.
 *
 * @author Thomas Andraschko / last modified by $Author$
 * @version $Revision$
 * @since 0.4
 */
@ResourceDependencies({
	@ResourceDependency(library = "primefaces-extensions", name = "primefaces-extensions.css")
})
public class RequiredLabel extends HtmlOutputLabel implements Attachable {

	public static final String COMPONENT_FAMILY = "org.primefaces.extensions.component";
	private static final String DEFAULT_RENDERER = "org.primefaces.extensions.component.RequiredLabelRenderer";
	private static final String OPTIMIZED_PACKAGE = "org.primefaces.extensions.component.";

	public static final String SPAN_DEFAULT_STYLE_CLASS = "pe-label-required-indicator";

	/**
	 * Properties that are tracked by state saving.
	 *
	 * @author  Thomas Andraschko / last modified by $Author$
	 * @version $Revision$
	 */
	protected enum PropertyKeys {

		requiredIndicator;

		private String toString;

		PropertyKeys(final String toString) {
			this.toString = toString;
		}

		PropertyKeys() {
		}

		@Override
		public String toString() {
			return ((this.toString != null) ? this.toString : super.toString());
		}
	}

	public RequiredLabel() {
		setRendererType(DEFAULT_RENDERER);
	}

	@Override
	public String getFamily() {
		return COMPONENT_FAMILY;
	}

	public String getRequiredIndicator() {
		return (String) getStateHelper().eval(PropertyKeys.requiredIndicator, "*");
	}

	public void setRequiredIndicator(final String requiredIndicator) {
		setAttribute(PropertyKeys.requiredIndicator, requiredIndicator);
	}

	@SuppressWarnings("unchecked")
	public void setAttribute(final PropertyKeys property, final Object value) {
		getStateHelper().put(property, value);

		List<String> setAttributes =
		    (List<String>) this.getAttributes().get("javax.faces.component.UIComponentBase.attributesThatAreSet");
		if (setAttributes == null) {
			final String cname = this.getClass().getName();
			if (cname != null && cname.startsWith(OPTIMIZED_PACKAGE)) {
				setAttributes = new ArrayList<String>(6);
				this.getAttributes().put("javax.faces.component.UIComponentBase.attributesThatAreSet", setAttributes);
			}
		}

		if (setAttributes != null && value == null) {
			final String attributeName = property.toString();
			final ValueExpression ve = getValueExpression(attributeName);
			if (ve == null) {
				setAttributes.remove(attributeName);
			} else if (!setAttributes.contains(attributeName)) {
				setAttributes.add(attributeName);
			}
		}
	}
}