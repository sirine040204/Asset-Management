from rest_framework.renderers import JSONRenderer

class EnterpriseJSONRenderer(JSONRenderer):
    """
    Standardizes the API response format for all endpoints.
    """
    def render(self, data, accepted_media_type=None, renderer_context=None):
        status_code = renderer_context['response'].status_code if renderer_context else 200
        
        # If it's already a formatted response (e.g., from custom exception handler)
        if isinstance(data, dict) and 'success' in data:
            return super().render(data, accepted_media_type, renderer_context)

        if status_code >= 400:
            response_data = {
                'success': False,
                'error_code': 'API_ERROR',
                'message': 'An error occurred processing the request.',
                'errors': data
            }
        else:
            # Handle pagination
            if isinstance(data, dict) and 'results' in data and 'count' in data:
                response_data = {
                    'success': True,
                    'message': 'Success',
                    'data': data['results'],
                    'meta': {
                        'count': data['count'],
                        'next': data.get('next'),
                        'previous': data.get('previous')
                    }
                }
            else:
                response_data = {
                    'success': True,
                    'message': 'Success',
                    'data': data
                }

        return super().render(response_data, accepted_media_type, renderer_context)
