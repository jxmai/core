package org.primefaces.extensions.component.sdashboard;

import java.io.IOException;

import javax.faces.component.UIComponent;
import javax.faces.context.FacesContext;
import javax.faces.context.ResponseWriter;

import org.primefaces.json.JSONObject;
import org.primefaces.renderkit.CoreRenderer;
import org.primefaces.util.HTML;
import org.primefaces.util.WidgetBuilder;

public class SDashboardRenderer extends CoreRenderer {

    @Override
    public void encodeEnd(FacesContext context, UIComponent component) throws IOException {
        final SDashboard sDashBoard = (SDashboard) component;
        encodeMarkup(context, sDashBoard);
        encodeScript(context, sDashBoard);
    }

    /**
     * 
     * @param context
     * @param sDashBoard
     * @throws IOException
     */
    private void encodeMarkup(FacesContext context, final SDashboard sDashBoard)
            throws IOException {
        final ResponseWriter writer = context.getResponseWriter();
        final String clientId = sDashBoard.getClientId();
        final String widgetVar = sDashBoard.resolveWidgetVar();

        writer.startElement("div", sDashBoard);
        writer.writeAttribute("id", clientId, "id");
        writer.writeAttribute(HTML.WIDGET_VAR, widgetVar, null);
        writer.endElement("div");
    }

    /**
     * 
     * @param context
     * @param sDashBoard
     * @throws IOException
     */
    private void encodeScript(final FacesContext context, final SDashboard sDashBoard)
            throws IOException {
        final WidgetBuilder wb = getWidgetBuilder(context);
        final String clientId = sDashBoard.getClientId(context);

        wb.initWithDomReady("ExtSDashboard", sDashBoard.resolveWidgetVar(), clientId);
        
        
        
        JSONObject object = new JSONObject();
        object.put("widgetTitle", "Text Widget");
        object.put("widgetId", "id2");
        object.put("enableRefresh", true);
        object.put("widgetContent", "sdfsadfasdfasdsdf");
        
        
        wb.attr("dashboardData", "[" + object.toString() + "]");
        
        
        
//        wb.attr("widgetId", sDashBoard.getWidgetId());
//        wb.attr("widgetTitle", sDashBoard.getWidgetTitle());
//        wb.attr("widgetContent", sDashBoard.getWidgetContent());
        wb.finish();
    }
}
